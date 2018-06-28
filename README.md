# mirador-share-workspace

When collaborating with others, it is useful to be able to share workspaces across different computers. This Mirador plugin enables this.

## Back-end requirements and what to do when your app has no back-end

Since the implementation of Mirador's `saveSession` configuration option [is buggy](https://github.com/ProjectMirador/mirador/issues/746), this plugin assumes a back-end that can handle POST requests encoded as `multipart/form-data` at the same route as the Mirador viewer. That back-end can then inject the serialized state into the Mirador constructor in the viewer page's `<script>` tag. The POST route can be configured by modifying the template in `loadWorkspacePanel.js`.

If you would like to use this plugin with the `saveSession` option (presumably in an app with no back-end), please use the `savesession-on` branch of this repository.

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
