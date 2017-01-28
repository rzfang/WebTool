<header>
  <h2>Web Tool</h2>
  <menu>
    Tool :
    <select ref='Menu' onchange='{ToolChange}'>
      <option value='keycode'>keyCode Detect</option>
      <option value='re'>Regular Expression Test</option>
      <option value='datetime'>Datetime Transform</option>
      <option value='convert'>Convert List</option>
      <option value='colors'>Color Conside</option>
      <option value='endecode'>String EnDecode</option>
      <option value='post'>POST to a Page</option>
      <option value='window'>Window Open Script</option>
      <option value='ipv426'>IP v4 to v6 Convert</option>
      <option value='datauri'>File to Data URI</option>
      <option value='json'>JSON Editor</option>
      <option disabled>-----------------------</option>
      <option value='payment.php'>Payment</option>
      <option value='read'>Read</option>
    </select>
  </menu>
  <script>
    this.on(
      'mount',
      function () {
        if (typeof window === 'undefined') {
          return;
        }

        let Pth = location.pathname.substr(1), // path name.
            Idx = Z.DOM.Find('header select>option[value="' + Pth + '"]')[0].Index(); // index of the current option.

        Z.DOM.Find('header select')[0].selectedIndex = Idx;
      });

    ToolChange (Evt) {
      let OptA = Evt.Element().Children();

      OptA.Each(function(Obj, Idx) {
        if (!Obj.selected) {
          return;
        }

        if (Obj.value.indexOf('.html') > 0) {
          window.location = '/#' + Obj.value.replace('.html', '');

          return false;
        }

        window.location = Obj.value;

        return false;
      });
    }
  </script>
</header>