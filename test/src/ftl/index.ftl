<#assign title="TEST - asset-inject-html-webpack-plugin">

<!DOCTYPE html>
<html lang="en">
<head>
<#include "./head.ftl">
<!-- css_inject_point inline_index -->
</head>
<body>

<h1>loading...</h1>

<#include "./foot.ftl">
<!-- js_inject_point if_local -->
<!-- js_inject_point inline_index if_online -->
<!-- js_inject_point asset_index-local-test if_local -->
<!-- js_inject_point asset_index-online-test if_online -->
</body>
</html>