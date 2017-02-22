<!DOCTYPE html>
<html lang="en" class="uk-height-1-1" style="background-color: #222">

<head>
    <!-- Meta Properties -->
    <meta charset="UTF-8">
    <title>BLOBBER.IO</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <!-- Audio -->
    <audio id="split_cell" src="/app/audio/split.mp3"></audio>
    <audio id="spawn_cell" src="/app/audio/spawn.mp3"></audio>
    <style>
        #startMenuRight {
            width: 330px;
        }
    </style>
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o)
                , m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-86484648-1', 'auto');
        ga('send', 'pageview');
    </script>
    <script>
      window._urq = window._urq || [];
      _urq.push(['initSite', '0ab90b14-987c-4d31-bc2f-509551ef2fae']);
      (function() {
      var ur = document.createElement('script'); ur.type = 'text/javascript'; ur.async = true;
      ur.src = ('https:' == document.location.protocol ? 'https://cdn.userreport.com/userreport.js' : 'http://cdn.userreport.com/userreport.js');
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ur, s);
      })();
    </script>
    <link href="{{& files.main.css}}" rel="stylesheet">
</head>
<body class="uk-height-1-1"> {{>body}}
    <script src="{{& files.main.js}}"></script>
</body>
</html>
