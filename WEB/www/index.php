<?php
header('Content-Type: text/html; charset=utf-8');

require('../global.php');
?>
<!DOCTYPE HTML>
<html>
  <head>
    <title><?= WEBSITE; ?></title>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'/>
    <meta name='description' content='程式開發輔助工具，尤其是網頁開發。program develop tool, especially in web design.'/>
    <meta name='keywords' content='網頁, 工具, 程式, 開發, Web, Tool, Program, Develop, HTML, Javascript, CSS'/>
    <meta name='author' content='RZ Fang'/>
    <link rel='icon' href='favicon.ico' type='image/ico'/>
    <link rel='stylesheet' type='text/css' href='resource/css.css'/>
    <style type='text/css'> <!-- --> </style>
    <script language='javascript' src='resource/z.min.js'></script>
    <script language='javascript'>
    <!--
      window.onload = PageChange;
      window.onhashchange = PageChange;

      function PageChange(Evt)
      {
        if (Z(Evt.Element()) === null)
        {
          var Slct = Z('#Menu')[0],
              OptnVal = Slct.Children()[Slct.selectedIndex].value.replace('.html', ''),
              HshVal = window.location.hash.replace('#', '');

          if (HshVal !== OptnVal)
          {
            var HshOptn = Slct.Children('[value=\'' + HshVal + '.html\']');

            if (HshOptn.length > 0)
            { Slct.selectedIndex = HshOptn[0].Index(); }
          }
        }

        var PgNm = (window.location.hash === '') ? 'keycode.html' : (window.location.hash.replace('#', '') + '.html');

        Z('iframe')[0].contentWindow.location.replace(PgNm); // replace won't trigger history log.
      }

      function ToolChange(Evt)
      {
        var OptA = Evt.Element().Children();

        OptA.Each(function(Obj, Idx)
          {
            if (Obj.selected)
            {
              window.location = '#' + Obj.value.replace('.html', '');

              return false;
            }
          });
      }
    -->
    </script>
  </head>
  <body>
    <div id='Template'> <!-- Template -->
    </div>
    <div id='Base'>
      <header>
        <span>Web Tool</span>
        <span></span>
        <span>Please use the browser which supports HTML5 &amp; CSS3.</span>
        <menu>
          Tool :
        	<select id='Menu' style='vertical-align: middle;' onchange='ToolChange(event);'>
        		<option value='keycode.html' selected='true'>keyCode Detect</option>
        		<option value='re.html'>Regular Expression Test</option>
        		<option value='datetime.html'>Datetime Transform</option>
        		<option value='convert.html'>Convert List</option>
        		<option value='colors.html'>Color Conside</option>
        		<option value='endecode.html'>String EnDecode</option>
        		<option value='post.html'>POST to a Page</option>
        		<option value='window.html'>Window Open Script</option>
        		<option value='ipv426.html'>IP v4 to v6 Convert</option>
        		<option value='datauri.html'>File to Data URI</option>
        		<option value='json.html'>JSON Editor</option>
        	</select>
        </menu>
      </header>
      <div id='Main'> <!-- Main -->
         <iframe id='Containar' name='Containar' src=''></iframe>
      </div>
      <footer>
        Reproduced or quoted, please indicate the source. <a href='index.php'><?= WEBSITE; ?></a>
        <?= COPYRIGHT; ?>
      </footer>
    </div>
  </body>
</html>
