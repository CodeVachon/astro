---
title: Step by Step Install of Graphite with Carbon and StatsD on CentOS 7.1.x
featured: false
description: Recently, we started to build our own Graphite StatsD Server. We tried following a couple of step by step guides, but all them were seeming out of date.  And we encountered several errors, many of which did not have defined documentation.
image: https://blog.christophervachon.com/content/images/2019/05/devops-1.jpg
date_orig: 2015-12-09T16:00:00.000-05:00
date: 2015-12-09
draft: false
tags: ["devops"]
---

Recently, we started to build our own Graphite StatsD Server. We tried following a couple of step by step guides, but all them were seeming out of date.  And we encountered several errors, many of which did not have defined documentation.

We ran this first from a Vagrant VirtualBox, and then on a Virtual Server, both running a fresh install of CentOS 7.1.x.

---

**TL;DR**

## Step 1 - Verify CentOS

first thing we need to do is to verify that we have the correct version of CentOS.  This guide is specifically for `CentOS 7.1.x`

```
cat /etc/centos-release
```

## Step 2 - Install Dependancies

Now we need to install all our system requirements to get everything running.

```
sudo yum -y update
sudo yum install -y epel-release
sudo yum install -y httpd net-snmp perl pycairo mod_wsgi python-devel git gcc-c++
sudo yum install -y python-pip node npm
```

**Note:** At the time we were running this, the `epel-release` repo was in the process of being updated and produced and error.  We simply needed to wait a few hours for the update to be completed and were able to proceed.

With `PIP` now installed, we want to install all the Python Libraries including graphite and carbon.

```
sudo pip install 'django<1.6'
sudo pip install 'Twisted<12'
sudo pip install 'django-tagging<0.4'
sudo pip install pytz
sudo pip install whisper
sudo pip install graphite-web
sudo pip install carbon
```

**Note:** some of the later install scripts will not function with newer versions of some of these libraries, so ensure you have the older ones.

## Step 3 - Configuration

The graphite install has several config file examples for us to use, so our first step will be the copy all of those and modify them.

```
sudo cp /opt/graphite/conf/storage-schemas.conf.example /opt/graphite/conf/storage-schemas.conf
sudo cp /opt/graphite/conf/storage-aggregation.conf.example /opt/graphite/conf/storage-aggregation.conf
sudo cp /opt/graphite/conf/graphite.wsgi.example /opt/graphite/conf/graphite.wsgi
sudo cp /opt/graphite/conf/graphTemplates.conf.example /opt/graphite/conf/graphTemplates.conf
sudo cp /opt/graphite/conf/carbon.conf.example /opt/graphite/conf/carbon.conf
sudo cp /opt/graphite/webapp/graphite/local_settings.py.example /opt/graphite/webapp/graphite/local_settings.py
```

### Update Carbon Config

Update Carbon to storage schemas. This will tell your system how to hang on to data for.  This is important because data can build up very quickly.

```
sudo vi /opt/graphite/conf/storage-schemas.conf
```

Add

```
[default]
pattern = .*
retentions = 10s:4h, 1m:3d, 5m:8d, 15m:32d, 1h:1y
```

Now we start Carbon

```
sudo /opt/graphite/bin/carbon-cache.py start
```

### Update Graphite Config

Graphite will override default settings with values you set in a local_settings.py file.

```
sudo vi /opt/graphite/webapp/graphite/local_settings.py
```

Only thing we initially changed in here was the timezone information for our location and the `SECRET_KEY` value.  Once these are in, we can run the Database Setup.

```
sudo python /opt/graphite/webapp/graphite/manage.py syncdb
```

At the point, you should be able to run the Development copy of Graphite off Port `8080`.  If you want to try this, run `sudo /opt/graphite/bin/run-graphite-devel-server.py /opt/graphite/`.  However, we will continue forward by setting up Apache to run Graphite for us.

### Setup Apache httpd

first, we can copy another example config file.

```
sudo cp /opt/graphite/examples/example-graphite-vhost.conf /etc/httpd/conf.d/graphite.conf
```

We will then need to make few changes to that file depending on the version of Apache httpd that was installed.  In our case, `2.4.x` was installed, so the default config does not work.

```
sudo vi /etc/httpd/conf.d/graphite.conf
```

and modify the bottom `Directory` directives to read as follows.

```
<Directory /opt/graphite/conf/>
        Require all granted
</Directory>
<Directory /opt/graphite/webapp/>
        Require all granted
</Directory>
<Directory /opt/graphite/webapp/content/>
        Require all granted
</Directory>
```

This will give httpd the correct permissions to run in those directories.

Next we need some log files for the system.

```
sudo chown apache:apache /opt/graphite/storage/log/webapp/
touch /opt/graphite/storage/log/webapp/error.log
sudo chown apache:apache /opt/graphite/storage/log/webapp/error.log
touch /opt/graphite/storage/log/webapp/access.log
sudo chown apache:apache /opt/graphite/storage/log/webapp/access.log
```

Httpd also needs some additional permissions

```
sudo chown apache:apache /opt/graphite/storage/graphite.db
```

We are now ready to enabled and start httpd

```
sudo systemctl enable httpd
sudo systemctl start httpd
```

You should at this point have a working graphite application running on the server name at port `80`.  However, you do not have much data at this point.  Only some system data from Carbon itself. Next we'll install and run StatsD.

### Install StatsD

This is the easy part.  StatsD as provided by Etsy is an open source project, and easy to install and run. We can use GIT (which we install above) to download the latest copy.

```
sudo git clone https://github.com/etsy/statsd.git /usr/local/src/statsd/
cd /usr/local/src/statsd/
sudo npm install
```

Next we'll configure for local.

```
sudo cp exampleConfig.js config.js
sudo vi config.js
```

and insert the following

```
{
  graphitePort: 2003,
  graphiteHost: "localhost",
  port: 8125,
  backends: [ "./backends/graphite" ]
}
```

Lastly, we will install `forever` globally to run statsD as service on the system.

```
sudo npm install -g forever
sudo npm install -g forever-service
sudo forever-service install statsd -s stats.js -o " config.js"
sudo service statsd start
```

Now you should have StatsD listening on `UDP:8125` (as per the config we set) and ready to accept data.  You can refer to [The Power of Statistics](https://blog.christophervachon.com/2015/11/30/the-power-of-statistics/) post to learn more on how to do that.

---

## Update

After 24 hours of running, system is stable.  However, we are still working out issues with Django Serving static assets. Once we have this worked out, I'll have another post here.

---

## Update - May 2019

Although this did work at the time, I have sense moved on to paid services for my performance monitoring.
