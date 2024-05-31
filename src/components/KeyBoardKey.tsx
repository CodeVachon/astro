import type { FC } from "react";

interface IKeyBoardKeyProps {
    className?: string;
    children?: React.ReactNode;
    keyModifier?: "cmd" | "ctrl" | "alt" | "shift" | "meta" | "none";
}

const KeyBoardKey: FC<IKeyBoardKeyProps> = ({ className = "", children, keyModifier = "none" }) => {
    const isMac =
        typeof navigator !== "undefined"
            ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
            : true;
    let mod = "";
    if (keyModifier === "cmd" || keyModifier === "meta") {
        if (isMac) {
            mod = "⌘";
        } else {
            mod = "Ctrl";
        }
    } else if (keyModifier === "ctrl") {
        mod = "Ctrl";
    } else if (keyModifier === "alt") {
        if (isMac) {
            mod = "⌥";
        } else {
            mod = "Alt";
        }
    } else if (keyModifier === "shift") {
        mod = "Shift";
    }

    return (
        <code
            id="CommandPalletShortcutNote"
            className="inline-block rounded bg-primary px-1 py-0.5 font-mono text-white"
        >
            {mod && mod.length > 0 && <span>{mod}</span>}
            {children}
        </code>
    );
};

export default KeyBoardKey;
export { KeyBoardKey };
