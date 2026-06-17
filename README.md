# DOM Explorer - Task Manager

This is a task manager app I built using HTML, CSS and JavaScript. No frameworks used, everything is vanilla JS.

## What this app does

- You can add tasks with a title and category
- Edit, delete and mark tasks as complete
- Dark mode and light mode toggle
- Clear all tasks button
- Shows total, completed and pending task count
- There is also a section for event propagation demo and browser rendering pipeline

---

## Concepts I learned

### Parsing
So basically when the browser gets an HTML file, it reads the code line by line. This process of reading and understanding the HTML is called parsing. The browser goes through the whole document from top to bottom and figures out the structure.

### Tokenization
This happens during parsing. The browser breaks the HTML into small chunks called tokens. Like if you write `<h1>Hello</h1>`, it breaks it into tokens like - opening tag `<h1>`, text `Hello`, closing tag `</h1>`. Each piece becomes a token that the browser can work with.

### DOM Tree
After parsing, the browser creates a tree structure called the DOM tree. Every element in HTML becomes a node in this tree. Like `<html>` is the root, `<body>` is its child, and whatever is inside body becomes children of body. JavaScript uses this tree to find and change elements on the page.

Example:
```
html
 ├── head
 │    └── title
 └── body
      ├── h1
      └── div
           └── button
```

### CSSOM Tree
This is like DOM tree but for CSS. When the browser reads CSS, it creates a separate tree called CSSOM (CSS Object Model). It stores all the styles - like what color, font size, margin etc each element should have.

### Render Tree
The browser combines DOM tree and CSSOM tree to make the Render Tree. This tree only has the elements that will actually show on screen. So if something has `display: none`, it wont be in the render tree. After this the browser does layout and painting to show the page.

```
DOM Tree + CSSOM Tree = Render Tree
```

### Event Bubbling
When you click on an element, the event starts from that element and goes up to its parent, then grandparent and so on. This is bubbling - it goes from inside to outside.

Like if you click a button inside a div inside another div:
```
Child clicked (first)
Parent clicked (then)
Grandparent clicked (last)
```

This is the default behavior when you use addEventListener.

### Event Capturing
This is the opposite of bubbling. The event goes from outside to inside. So grandparent fires first, then parent, then child.

```
Grandparent clicked (first)
Parent clicked (then)
Child clicked (last)
```

To use capturing you pass `true` as the third argument in addEventListener:
```js
element.addEventListener("click", function() {
    console.log("captured!");
}, true);
```

### Event Delegation
Instead of adding event listeners to every single button, you add one listener to the parent element. When any child is clicked, the event bubbles up to the parent and you can check which child was clicked using `e.target`.

This is useful because:
- Less event listeners = better performance
- Works even for elements added dynamically later

In my project I used this for handling edit, delete and complete buttons. One listener on the tasks container handles all of them.

---

## Technologies

- HTML
- CSS
- JavaScript
