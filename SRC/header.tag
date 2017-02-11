<header>
  <div>
    <h2>Web Tool</h2>
    <div>
      <h3>{TgtItm.Ttl}</h3>
      <button onclick={NavToggle}>Nav</button>
    </div>
  </div>
  <nav if={IsNavOn}>
    <ul>
      <li each={Itms} if={!IsTgt} >
        <a href={URL}>{Ttl}</a>
      </li>
    </ul>
  </nav>
  <style scoped>
    :scope { position: relative; }
    :scope>div { border-bottom-width: 1px; padding: 5px 0 0 5px; }
    h2 { margin: 0; font-size: 32px; font-style: italic; }
    h3 { flex: 1; margin: 0; font-weight: normal; }
    :scope>div>div { display: flex; align-items: baseline; }
    button { flex: 50px; max-width: 50px; }

    @media screen and (min-width: 480px) {
      :scope>div { display: flex; align-items: baseline; }
      h2 { flex: initial; padding-right: 10px; }
      :scope>div>div { flex: 1; }
    }

    nav { z-index: 10; position: absolute; right: 5px; border-width: 1px; padding: 5px; box-shadow: -1px 1px 3px; background-color: #ffffff; }
    ul { margin: 0; padding: 0; }
    li { list-style-type: none; }
    a { display: block; }
  </style>
  <script>
    this.Itms = [
        { Ttl: 'keyCode Detect',          URL: 'keycode' },
        { Ttl: 'Regular Expression Test', URL: 're' },
        { Ttl: 'Datetime Transform',      URL: 'datetime' },
        { Ttl: 'Convert List',            URL: 'convert' },
        { Ttl: 'Color Conside',           URL: 'colors' },
        { Ttl: 'String EnDecode',         URL: 'endecode' },
        { Ttl: 'POST to a Page',          URL: 'post' },
        { Ttl: 'Window Open Script',      URL: 'window' },
        { Ttl: 'IP v4 to v6 Convert',     URL: 'ipv426' },
        { Ttl: 'File to Data URI',        URL: 'datauri' },
        { Ttl: 'JSON Edit',               URL: 'json' },
        { Ttl: 'Payment',                 URL: 'payment.php' },
        { Ttl: 'Read',                    URL: 'read' }
      ];
    this.TgtItm = this.Itms[0];
    this.IsNavOn = false;

    this.mixin('Z.RM');

    // this.on(
    //   'mount',
    //   function () {
        this.OnBrowser(() => {
          for (let i = 0; i < this.Itms.length; i++) {
            if (this.Itms[i].URL === location.pathname.substr(1)) {
              this.Itms[i].IsTgt = true;
              this.TgtItm = this.Itms[i];

              break;
            }

            this.Itms[i].IsTgt = false;
          }

          // this.update();
        });
      // });

    NavToggle () {
      this.IsNavOn = !this.IsNavOn;

      this.update();
    }
  </script>
</header>