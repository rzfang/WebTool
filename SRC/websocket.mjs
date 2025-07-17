import crypto from 'crypto';
import Is from 'rzjs/Is.js';
import Log from 'rzjs/Log.js';
import net from 'net';

const SckA = []; // socket

let Svr; // socket Server.

//==== functions. ======================================================================================================

/*
  @ Socket object.
  @ socket transmitted Data String. */
function IsHandShake (Sck, DataStr) {
  if (!Sck || !Is.Object(Sck) || !DataStr || !Is.String(DataStr)) { return false; }

  if (DataStr.indexOf('GET') !== 0 || DataStr.indexOf('HTTP') < 1 || DataStr.indexOf('Sec-WebSocket-Version') < 1)
  { Sck.IsShkd = false; }
  else
  { Sck.IsShkd = true; }

  return Sck.IsShkd;
}

/*
  @ Socket object.
  @ socket transmitted Data String. */
function HandShakeResponse (Sck, DataStr) {
  if (!Sck || !Is.Object(Sck) || !DataStr || !Is.String(DataStr)) { return -1; }

  const SHA1 = crypto.createHash('sha1'); // SHA1 algorithm crypted object.
  const T = {
    Key: DataStr.match(/Sec-WebSocket-Key: (.+)/),
    Prtcl: DataStr.match(/Sec-WebSocket-Protocol: (.+)/),
  }; // protocol.

  if (!T.Key || T.Key.length < 2) { return -2; }

  SHA1.update(T.Key[1] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');

  const Key = SHA1.digest('base64');
  const Prtcl = (!T.Prtcl || T.Prtcl.length < 2) ? '' : T.Prtcl[1]; // porotocol of websocket.

  Sck.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + Key + '\r\n' +
    (Prtcl ? ('Sec-WebSocket-Protocol: ' + Prtcl) : 'chat') +
    '\r\n\r\n');

  Sck.IsShkd = true;

  return 0;
}

function DataFetch (Data) {
  if (!Data || !(Data instanceof Buffer)) { return ''; }

  let MskData; // mask data.
  let MskKy; // mask key.

  switch (Data[1] & 127) {
    case 126:
      MskKy = Data.slice(4, 8); // 4 = 1 + 1 + 2
      MskData = Data.slice(8);

      break;

    case 127:
      MskKy = Data.slice(10, 14); // 10 = 1 + 1 + 8
      MskData = Data.slice(14);

      break;

    default:
      MskKy = Data.slice(2, 6); // 2 = 1 + 1 + 0
      MskData = Data.slice(6);
  }

  const RlData = new Buffer(MskData.length);

  for (let i = 0; i < RlData.length; i++) { RlData[i] = MskKy[i % 4] ^ MskData[i]; }

  return RlData;
}

/* pack data to be websocket package buffer.
  @ buffer to pack to.
  Return: data package for socket. or null as error. */
function DataPack (Data) {
  if (!Data || !(Data instanceof Buffer)) { return null; }

  let PrxBfr; // prefox buffer.

  //==== data length info of package. ====

  if (Data.length <= 125) {
    PrxBfr = new Buffer(2);
    PrxBfr[1] = Data.length;
  }
  else if (Data.length <= 65535) {
    PrxBfr = new Buffer(4);
    PrxBfr[1] = 126;
    PrxBfr[2] = Math.floor(Data.length / 256);
    PrxBfr[3] = Data.length % 256;
  }
  else {
    PrxBfr = new Buffer(10);
    PrxBfr[1] = 127;

    for (let i = 0; i < 8; i++) { PrxBfr[2 + i] = Math.floor(Data.length / Math.pow(256, 8 - i)); }
  }

  PrxBfr[0] = 0x81;

  return Buffer.concat([ PrxBfr, Data ]);
}

function SystemPost (Str) {
  if (!Str || !Is.String(Str)) { return -1; }

  const Data = DataPack(new Buffer(Str));

  for (let i = 0; i < SckA.length; i++) { SckA[i].write(Data); }

  return 0;
}

/*
  @ socket object after process extending.
  Return: 0 as OK, < 0 as error. */
function TextTransmit (Sck) {
  if (!Sck || !(Sck instanceof net.Socket) || !Sck.Data || !(Sck.Data instanceof Buffer)) { return -1; }

  // Log(Sck.Data.toString(), 3);

  const Data = DataPack(Sck.Data);

  for (let i = 0; i < SckA.length; i++) { SckA[i].write(Data); }

  return 0;
}

function BinaryReceive (Sck) {
  Log(Sck.Data, 3);
}

function Disconnect (Sck) {
  if (!Sck || !(Sck instanceof net.Socket) || !Sck.Data || !(Sck.Data instanceof Buffer)) { return -1; }

  for (let i = 0; i < SckA.length; i++) {
    if (SckA[i] === Sck) {
      SckA.splice(i, 1);
      Sck.end();

      break;
    }
  }

  SystemPost(Sck.Ncknm + ' leaved. Bye, ' + Sck.Ncknm + '.');

  return 0;
}

const Wbsckt = {
  Initialize: Port => {
    if (!Port || !Is.Number(Port)) {
      Log('socket server can not work with such values.');

      return;
    }

    Svr = net.createServer(ServerCreate);

    Svr.listen(Port, () => { Log('socket server starts with port 9002.'); });

    return;

    function ServerCreate (Sck) {
      if (!Sck) {
        Log('socket comes with error.', 1);

        return -1;
      }

      Sck.IsShkd = false; // 'IsShkd' = hand Shaked.
      Sck.Data = new Buffer(0);

      SckA.push(Sck);
      Sck.on('end', () => { Log('end', 3); });

      Sck.on(
        'error',
        error => {
          Log('error', 3);
          Log(error, 3);
        });

      Sck.on(
        'data',
        Data => {
          if (!this.IsShkd) {
            const DataStr = Data.toString();

            if (IsHandShake(this, DataStr)) {
              HandShakeResponse(this, DataStr);

              return 1;
            }
          }

          this.Data = Buffer.concat([ this.Data, DataFetch(Data) ]);

          // check if data transmission is finished.
          if (Data[0] & 128 === 0) { return 2; }

          switch (Data[0] & 15) {
            case 1:
              TextTransmit(this);

              break;

            case 2:
              BinaryReceive(this);

              break;

            case 8:
              Disconnect(this);

              break;

            case 9:
              Log('ping control frame.', 3);

              break;

            case 10:
              Log('pong control frame.', 3);

              break;

            default:
              Log('strange TCP/IP package.', 1);

              return -1;
          }

          this.Data = null;
          this.Data = new Buffer(0);
        });

      // Sck.pipe(Sck);

      return 0;
    }
  }};

Wbsckt.Initialize(9002);

export default Wbsckt;
