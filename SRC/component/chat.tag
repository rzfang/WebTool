<chat>
  <div if={!CnUsWs}>your browser does not support WebSocket.</div>
  <div if={CnUsWs}>
    <message each={Msgs} nm={Nm} msg={Msg} clr={Clr}/>
    <div if={Nm}>
      <span>{Nm}</span>
      <textarea ref='Msg' type="text" placeholder="..." onkeydown={KeyHandle} onkeyup={Send}></textarea>
      <button onclick={Send}>Send</button>
    </div>
    <div if={!Nm}>
      <input ref='Nm' type="text" placeholder="your name" maxlength="10" onkeyup={Join}/>
      <button onclick={Join}>Join</button>
    </div>
  </div>
  <style scoped>
    :scope>*:last-child { margin-bottom: 10px; }
    textarea { vertical-align: top; }
  </style>
  <script>
    let KyShft = false, // key shift.
        WbSck; // WebSocket object.

    this.CnUsWs = true; // can use WebSocket.
    this.Nm = '';
    this.Msgs = [];

    if (!window.hasOwnProperty('WebSocket')) { this.CnUsWs = false; }

    this.mixin('Z.RM');

    this.on(
      'mount',
      () => {
        if (!this.CnUsWs) { return; }

        this.MessageAdd({ Msg: 'you as a guest in 3 seconds...', Clr: '#808080' });

        setTimeout(this.Start, 3000);
      });

    Start () {
      let Href = (location.protocol === 'https:' ? 'wss://' : 'ws://')  + location.hostname + ':9003';

      WbSck = new WebSocket(Href, 'chat');
      WbSck.onopen = (Evt) => { this.MessageAdd({ Msg: 'welcome, guest.', Clr: '#808080' }); };
      WbSck.onclose = (Evt) => { this.MessageAdd({ Msg: 'connection has closed.', Clr: '#808080' }); };

      WbSck.onmessage = (Evt) => {
        let WbSckDt;

        try {
          WbSckDt = Evt.data && JSON.parse(Evt.data) || null;
        }
        catch (Err) {
          console.log(Err);
          console.log(Evt.data);
        }

        if (WbSckDt && WbSckDt.Cmd) { return; }

        this.MessageAdd(WbSckDt);
      };
    }

    JSONSend (Obj) {
      if (!WbSck || !Z.Is.Object(Obj)) { return; }

      WbSck.send(JSON.stringify(Obj));
    }

    MessageAdd (Msg) {
      let Msgs = this.Msgs;

      Msgs.push(Msg);
      this.update({ Msgs });
    }

    Join (Evt) {
      if (Evt.keyCode && Evt.keyCode !== 13) { return; }

      let Nm = this.refs.Nm;

      if (!Nm || !Nm.value || !Nm.value?.trim()) { return alert('you need a name to start.'); }

      this.Nm = Nm.value;

      this.JSONSend({ Msg: this.Nm + ' joined.', Clr: '#808080' });
      setTimeout(() => { this.refs.Msg.focus(); }, 500);
    }

    KeyHandle (Evt) {
      if (Evt.keyCode && Evt.keyCode === 16) { KyShft = true; }
    }

    Send (Evt) {
      if (Evt.keyCode) {
        switch (Evt.keyCode) {
          case 13:
            if (KyShft) { return; }
            break;

          case 16:
            KyShft = false;

          default:
            return; // typing.
        }
      }

      let Msg = this.refs.Msg,
          MsgTxt = Msg && Msg.value && Msg.value?.trim() || '';

      if (!MsgTxt) { return alert('say nothing ?!'); }

      this.JSONSend({ Nm: this.Nm, Msg: MsgTxt, Clr: '#000000' });

      Msg.value = '';
    }
  </script>
</chat>

<message>
  <div if={opts.nm}>{opts.nm} : </div>
  <pre style='color: {opts.clr};'>{opts.msg}</pre>
  <style scoped>
    :scope { display: flex; margin: 10px 0; }
    :scope:hover { background-color: #f0f0f0; }
    :scope>div { flex: 0 1 auto; margin-right: 10px; }
    :scope>pre { flex: 1; margin: 0; }
  </style>
</message>
