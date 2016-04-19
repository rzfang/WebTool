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
    <script src="https://cdn.jsdelivr.net/riot/2.3/riot+compiler.min.js"></script>
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
      var Byrs = [{Nm: 'RZ'}, {Nm: 'Amanda'}],
          Data = {
            Byrs: Byrs,
            Itms: [{ Dt: '2016-04-10', Itm: 'Apple', Prc: '1000', Byr: Byrs[0], Cmt: 'this is an apple' }]
          };
    </script>
    <script>riot.mount('#Bs', 'payment')</script>
  </body>
</html>
<!--=================================================================================================================-->
