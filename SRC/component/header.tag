<header>
  <div>
    <h2>Web Tool</h2>
    <div>
      <h3>{TgtItm.Ttl}</h3>
      <button onclick={NavToggle}>Menu</button>
    </div>
  </div>
  <nav if={IsNavOn}>
    <ul>
      <li each={Itms}>
        <a if={URL && !IsTgt} href={URL}>{Ttl}</a>
        <span if={!URL || IsTgt}>{Ttl}</span>
      </li>
    </ul>
  </nav>
  <style scoped>
    :scope { position: sticky; top: 0; z-index: 1; background-color: rgba(255,255,255,.9); }
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
        { Ttl: '----',                    URL: '' },
        { Ttl: 'Payment Note',            URL: 'payment' },
        { Ttl: 'Feed Read',               URL: 'read' },
        { Ttl: 'Countdown Notify',        URL: 'countdown' },
        { Ttl: 'Moment Chat',             URL: 'chat' }
      ];
    this.TgtItm = this.Itms[0];
    this.IsNavOn = false;

    this.mixin('Z.RM');

    this.OnBrowser(() => {
      for (let i = 0; i < this.Itms.length; i++) {
        if (this.Itms[i].URL === location.pathname.substr(1)) {
          this.Itms[i].IsTgt = true;
          this.TgtItm = this.Itms[i];

          break;
        }

        this.Itms[i].IsTgt = false;
      }
    });

    NavToggle () {
      this.IsNavOn = !this.IsNavOn;
    }
  </script>
</header>