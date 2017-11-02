# mirador-share-workspace

When collaborating with others, it is useful to be able to share workspaces across different computers. This Mirador plugin enables this.

## Setup

You can find production-ready build artifacts inside the 'dist/' folder.

Alternatively, clone this repository and do:

```bash
npm install
gulp
```

Now look in the 'dist/' folder. Drop these files into your Mirador build output directory and point your webpage to them:

```html
<!DOCTYPE html>
<html>
    <head>
        ...
        <link rel="stylesheet" type="text/css" href="mirador-combined.css">
        <link rel="stylesheet" type="text/css" href="MiradorShareWorkspace.min.css">
        ...
    </head>
    <body>
        <div id="viewer"></div>

        <script src="mirador.js"></script>
        <script src="MiradorShareWorkspace.min.js"></script>

        <script type="text/javascript">

        $(function() {
            Mirador({
                ...
```
