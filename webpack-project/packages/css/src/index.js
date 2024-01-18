import styles from "./index.less";

const node = document.createElement("span");

node.textContent = "Hello world";

node.className = styles.text;

document.body.appendChild(node);
