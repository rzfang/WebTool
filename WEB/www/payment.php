<?php
header('Content-Type: text/html; charset=utf-8');
//======================================================================================================================
?>
<!DOCTYPE HTML>
<html>
  <head>
    <title></title>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'/>
    <meta name='description' content=''/>
    <meta name='keywords' content=''/>
    <meta name='author' content=''/>
    <link rel='stylesheet' type='text/css' href='resource/pay.css'/>
    <style type='text/css'></style>
    <script src='resource/include.js'></script>
    <script src="https://cdn.jsdelivr.net/riot/2.4/riot+compiler.min.js"></script>
    <script src='resource/payment.tag' type='riot/tag'></script>
  </head>
  <body>
    <header>
      <h2>Web Tool - Payment</h2>
    </header>
    <nav></nav>
    <main id='Bs'></main>
    <footer></footer>
    <script>
      (function run () {
        var RAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        window.requestAnimationFrame = RAF;

        if (!window.localStorage || !window.requestAnimationFrame) {
          window.document.getElementById('Bs').innerHTML = 'your browser is not supported.';

          return;
        }

        riot.mount('#Bs', 'payment');
      })();
    </script>
  </body>
</html>
<!--=================================================================================================================-->
