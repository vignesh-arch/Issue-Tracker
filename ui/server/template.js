import serialize from 'serialize-javascript';

export default function template(body, data) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Mern Stack Application</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <style>
      .panel-title a {
        display: block;
        width: 100%; 
        cursor: pointer;
      }
      table.table-hover tr{
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <!--Page generated from template. -->
    <div id="content">${body}</div>
    
    <script>window.__INITIAL_DATA__=${serialize(data)}</script>
    <script src="/env.js"></script>
    <script src="/vendor.bundle.js"></script>
    <script src="/app.bundle.js"></script> 
  </body>
</html>
`;
}
