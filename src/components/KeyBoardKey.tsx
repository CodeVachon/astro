/**
 * KeyBoardKey Component
 *
 * Displays keyboard shortcuts with platform-aware modifier key symbols.
 * Automatically shows ⌘ on Mac and Ctrl on Windows/Linux.
 *
 * @module KeyBoardKey
 */

import ClassNames from "@codevachon/classnames";
import type { FC } from "react";

/**
 * Props for the KeyBoardKey component
 */
interface IKeyBoardKeyProps {
    /** Additional CSS classes */
    className?: string;
    /** The key character(s) to display */
    children?: React.ReactNode;
    /** Modifier key to show before the main key */
    keyModifier?: "cmd" | "ctrl" | "alt" | "shift" | "meta" | "none";
}

/**
 * Displays a keyboard key/shortcut with styled appearance
 *
 * Features:
 * - Platform-aware modifier symbols (⌘ on Mac, Ctrl on Windows)
 * - Option key shows ⌥ on Mac, Alt on Windows
 * - Styled as inline code block with primary color background
 *
 * @example
 * ```tsx
 * // Shows "⌘K" on Mac, "Ctrl+K" on Windows
 * <KeyBoardKey keyModifier="cmd">K</KeyBoardKey>
 *
 * // Shows just the key
 * <KeyBoardKey>Esc</KeyBoardKey>
 * ```
 */
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
            mod = "Ctrl+";
        }
    } else if (keyModifier === "ctrl") {
        mod = "Ctrl+";
    } else if (keyModifier === "alt") {
        if (isMac) {
            mod = "⌥";
        } else {
            mod = "Alt+";
        }
    } else if (keyModifier === "shift") {
        mod = "Shift+";
    }

    return (
        <code
            id="CommandPalletShortcutNote"
            className={new ClassNames(
                "inline-block rounded bg-primary px-1 py-0.5 font-mono text-white"
            )
                .add(className)
                .list()}
        >
            {mod && mod.length > 0 && <span>{mod}</span>}
            {children}
        </code>
    );
};

export default KeyBoardKey;
export { KeyBoardKey };
