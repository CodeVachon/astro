---
title: From REST to GraphQL - How To Build a GraphQL Server
featured: false
description: Exploring the Development of Refactoring a RESTful api to GraphQL
image: https://blog.christophervachon.com/content/images/2019/08/Screen-Shot-2019-08-22-at-15.25.43-1.png
date_orig: 2019-09-02T21:15:36.000-04:00
date: 2019-09-02
draft: false
tags: ["devops", "rest", "graphql"]
---

I have been researching and playing with [GraphQL](https://graphql.org/) for about the last 6 months to evaluate the potential implementation into our enterprise platforms. Because I am receiving multiple requests to customize the current RESTful APIs to make them more flexible and dynamic, I started looking into other solutions and quickly found GraphQL to be a solid choice.

To gauge the feasibility of GraphQL for our applications, I quickly developed a quick analog of one of my systems to see how quickly I could implement the platform. To this end, I created a Book Store application with 9 books and their associated authors, tags, genres, and images. Along with the basic application I created a standard RESTful API to feed a react application so that I could get a bench mark of the overall performance and workability (you can find that application on my Github: [github.com/CodeVachon/graphql-demo](https://github.com/CodeVachon/graphql-demo)).

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://blog.christophervachon.com/content/images/2019/09/bookstore.png" class="kg-image" alt="" loading="lazy"><figcaption>Screen Shot of the Book Store</figcaption></figure>

The Application in its RESTful state requires 31 GET Requests to the API to populate the index view requiring 34kb of request data. Although this functions rather well and in a reasonable amount of time and resources, there are a couple of drawback to this approach.

1.  31 Get Request equals 31 Potential Points of Failure and requires a significant amount of bloat in our react application to ensure graceful fail-overs.
2.  Because we are dealing with a traditional REST api, we do not have the option to select the columns we want, therefore we are getting several data points that we do not require.

```javascript
// GET:/rest/books/
[
    {
        id: "IaNFbTL33g",
        title: "Thrawn",
        deck: "In this definitive novel, readers will follow Thrawn’s ...",
        language: "english",
        coverImage: "/images/91SxgwHMc0L.jpg",
        publishDate: "2017-04-11",
        created: "...",
        updated: "...",
        isDeleted: 0
    }
];
```

There are several potential solutions to resolve the potential pitfalls of this standard RESTful API, but I am going to focus on GraphQL at this time.

## Things to Know about GraphQL

Before we get into setting up a GraphQL server, let's get familiar with some of the technical terms we need to know. In order to replace the current RESTful API, I will need five key features of a GraphQL Server: `Schema`, `Resolvers`/`RootValue`, `Query`, `Mutation`, and `Scalars`.

### 1) Schema

This is how we defined our data model to GraphQL. We tell the server what columns belong to what objects and how some of the relationships should work. The only required schema definition is `Query` which defines to the server which terms can be used to query and which attributes/properties can be passed into it.

### 2) Resolvers/RootValue

Depending on the flavour of GraphQL you are using, this can be called either the `RootValue` or the `Resolvers`. In essence, these are server side functions that tell GraphQL how to retrieve the data from our system(s). Although the options and definitions may vary based off the flavour being used, one thing remains constant that a Resolver needs to return all the data defined in the schema. GraphQL will sort out the details of whats needed for the response and what is not.

Resolvers must return the definitions for all of the Query, Mutations, and Scalars defined in the schema.

### 3) Query

These define what can be called and with what arguments or properties. For each Query defined in the schema, a definition must be provided to the Resolver/RootValue and they must return all of the data specified in the schema with the matching type.

### 4) Mutations

Similar to Queries, mutations provide definitions for creating, updating, and deleting data. There must also be a corresponding definition in the resolvers for each mutation. Although not covered in this post, I'll be covering mutations in the next blog post in this series.

### 5) Scalars

These are definitions for data types, and several come included with a base install of GraphQL such as `ID`, `Number`, `String`, and `Boolean`. You can also define custom scalars to expand the available datatypes available to GraphQL. The most common addition you will find is to add a scalar for `DateTime`. Although not covered in this post, I'll be covering adding scalars in the next blog post in this series.

## Setting up GraphQL on a NodeJS Server

In my project, I already have a database and express server setup. To get started with GraphQL I just need to add two additional dependancies to the project.

```
npm install express-graphql graphql --save
```

I then need to setup our Schema and Resolvers.

### Schema

I am going to start with three definitions in the schema, two custom types and the Query definition. Each type is defined similar to an Object with a property and value where the property name is something that must be returned by a resolver, and the value representing either a scalar or type.

<figure class="kg-card kg-code-card"><pre><code class="language-graphql">type Book {
    id: ID!
    title: String
    deck: String
    language: String
    coverImage: String
    publishDate: String
    created: String
    updated: String
    isDeleted: Boolean
    tags: [Tag]
}
type Tag {
    id: ID!
    name: String
    isDeleted: Boolean
    books: [Book]
}
type Query {
    book(id: ID!): Book
    books: [Book]
    tag(id: ID!): Tag
    tags: [Tag]
}
</code></pre><figcaption>Schema.gql</figcaption></figure>

Types and Scalars have two primary modifiers. A set of square brackets surrounding it denotes that multiple values of that type will be returned. An exclamation point denotes a value must be returned or passed when requested.

The `Query` type defines the selection methods that a client can use to get information from GraphQL. It usually defines how types are retrieved and any arguments that can be used to modify the query. However it can also be used to call server functions such as to generate a random number or get data from a user server side session.

> **Note**
> in this schema, `book` requires an `id` value matching the `ID` scalar to be passed and that it will return a `Book` type. `books` takes no arguments, and returns an array of `books`.

### Resolvers

Now that I have defined my schema, I need to define the resolvers to tell GraphQL how to get the data for it. In this context, because I already have services setup to return data for the RESTful API, its a quick and easy to get started.

<figure class="kg-card kg-code-card"><pre><code class="language-javascript">const booksService = require("./../services/books");
const tagsService = require("./../services/tags");

module.exports = {
book: ({ id }) =&gt; booksService.getItem(id),
books: () =&gt; booksService.getList(),
tag: ({ id }) =&gt; tagsService.getItem(id),
tags: () =&gt; tagsService.getList()
};</code></pre><figcaption>resolvers.js</figcaption></figure>

> **Note**
> Each of the keys being returned by this module matches a key defined in the `Query` type from the schema file.

These methods could just as easily make asynchronous requests directly to database or to a third party api. What's important is that each resolver returns all of the data needed to fulfill the return type from the schema. In that file I defined that `book` returns a `Book` type. this means that my `book` resolver must return all of the columns as defined in the `Book` type in the schema file.

This leads to a problem for the model. The `getItem()` function for a book does not return the information needed to populate tags. There are severals ways I can handle this problem, but I have found the most reusable way has been to use a [JavaScript Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) to define the data to GraphQL. By using classes, I can define the model once and use it in other classes (books linked to tags, and tags linked to books). To make this work, I add two new files to the project.

<figure class="kg-card kg-code-card"><pre><code class="language-javascript">const booksService = require("./../../services/books");

class Book {
constructor(id) {
return booksService.getItem(id).then((record) =&gt; {
for (let [key, value] of Object.entries(record)) {
this[key] = value;
}

            return this;
        });
    } // close constructor

    tags() {
        const Tag = require("./Tag");

        return booksService.getTagsForBook(this.id).then(
            (recordSet) =&gt; Promise.all(recordSet.map(
                (record) =&gt; new Tag(record.tag_id)
            ))
        );
    } // close tags

} // close Book

module.exports = Book;
</code></pre><figcaption>Book.js</figcaption></figure>

<figure class="kg-card kg-code-card"><pre><code class="language-javascript">const tagsService = require("./../../services/tags");

class Tag {
constructor(id) {
return tagsService.getItem(id).then((record) =&gt; {
for (let [key, value] of Object.entries(record)) {
this[key] = value;
}

            return this;
        });
    } // close constructor

    books() {
        const Book = require("./Book");

        return tagsService.getBooksForTag(this.id).then(
            (recordSet) =&gt; Promise.all(recordSet.map(
                (record) =&gt; new Book(record.book_id)
            ))
        );
    } // close books

    static getList() {
        return tagsService.getList().then(
            (recordSet) =&gt; Promise.all(recordSet.map(
                (record) =&gt; new Tag(record.id)
            ))
        );
    } // close getList

} // close Tag

module.exports = Tag;</code></pre><figcaption>Tag.js</figcaption></figure>

And refactor our resolvers to this

<figure class="kg-card kg-code-card"><pre><code class="language-javascript">const Book = require("./models/Book");
const Tag = require("./models/Tag");

module.exports = {
book: ({ id }) =&gt; new Book(id),
books: () =&gt; Book.getList(),
tag: ({ id }) =&gt; new Tag(id),
tags: () =&gt; Tag.getList()
};</code></pre><figcaption>resolvers.js</figcaption></figure>

With the schema now being fulfilled by the resolvers, I can now move on to setting up GraphQL with Express.

### Server Setup

GraphQL needs two things to start effectively with express; the Schema and the RootValue (which we have been calling resolvers). With these already defined above, I just need to add the dependancies to the application and setup GraphQL as a middleware in the Express App.

```
const express = require("express");
const app = express();
const graphqlHTTP = require("express-graphql");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { buildSchema } = require("graphql");

// ... App Setup

app.use("/graphql", graphqlHTTP({
  schema: buildSchema(
    readFileSync(
      resolve(__dirname, "./graphQL/schema.gql"),
      "utf-8"
    )
  ),
  rootValue: require("./graphQL/resolvers"),
  graphiql: true
}));

// ... App Continue to Listen
```

The `buildSchema` method from the `graphql` library converts the GQL schema definitions into javascript to be consumed by the server. I feed the resolvers definitions to rootValue to let GraphQL know how to get the data. Finally, I set the value of `graphiql` to `true` so that I can use the graphical interface to test the schema.

With all that in place I can now run the server with GraphQL.

## The Results

With the server running, and `graphiql` set to `true`, I can goto the `/graphql` endpoint on the server to test the schema.

<figure class="kg-card kg-image-card kg-width-wide"><img src="https://blog.christophervachon.com/content/images/2019/09/Screen-Shot-2019-09-02-at-20.14.30.png" class="kg-image" alt="" loading="lazy"></figure>

After refactoring the React Application on the front end, I achieved the following results.

1.  The index list view went from 31 GET Requests to 1 POST Request. Having to deal with a single request failure requires less code which also reduced the front-end application payload as well.
2.  The total payload from the index list view was also reduced from 34kb to 13kb due to fewer request headers and because I can now request only the columns I require for the view.

For anyone interested in exploring this use-case, I have provided the source code for this project on my Github at [github.com/CodeVachon/graphql-demo](https://github.com/liaodrake/graphql-demo). Check back later for more information as I continue this series on GraphQL with Mutations and Scalars.

---

## Some Additional Resources

GraphQL

[graphql.org](https://graphql.org/)

Getting Started with GraphQL & Node.Js

[graphql.org/graphql-js](https://graphql.org/graphql-js/)

GraphQL Cheet Sheet

[devhints.io/graphql](https://devhints.io/graphql)
