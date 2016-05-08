(function Z_Obj_API () {
  var Obj;

  /* Combine the seconde object into first object.
    'BsObj' = Base Object.
    'ExtObj' = Extend Object.
    'Md' = Mode, 0: always create another object, 1: overwrite the BsObj.
    Return: new object after combined, or null as error.
    Note: this is not perfect. */
  function Combine (BsObj, ExtObj, Md) {
    var RstObj;

    if (typeof BsObj !== 'object' || typeof ExtObj !== 'object') { return null; }

    if (!Md) {
      RstObj = {};

      for (var i in BsObj) { RstObj[i] = BsObj[i]; }
    }
    else { RstObj = BsObj; }

    for (var i in ExtObj) { RstObj[i] = ExtObj[i]; }

    return RstObj;
  }

  /* dig the children of given object.
    'Obj' = Object. the origin object which will be digged.
    'Pth' = Path. an array records each level of paht.
    'Flbck' = Fallback. optional, default undefined.
    Return: sub object, or fallback value. */
  function Dig (Obj, Pth, Flbck) {
    var Chld = Obj;

    if (!(Pth instanceof Array) || Pth.length === 0) { return Flbck; }

    if (!Obj || typeof Obj !== 'object') { return Flbck; }

    for (var i = 0; i < Pth.length; i++) {
      if (!Chld || !Chld.hasOwnProperty(Pth[i])) { return Flbck; }

      Chld = Chld[Pth[i]];
    }

    return Chld;
  }

  /* Merge the seconde object into first object.
    'BsObj' = Base Object.
    'ExtObj' = Extend Object.
    Return: BsObj after merge with ExtObj.
    Note: this is not perfect. */
  function Merge (BsObj, ExtObj) {
    if (BsObj === ExtObj || typeof ExtObj !== 'object' || ExtObj === null) { return ExtObj; }

    if (!BsObj || typeof BsObj !== 'object') {
      BsObj = JSON.parse(JSON.stringify(ExtObj));

      return BsObj;
    }

    for (var i in ExtObj) {
      if (!ExtObj.hasOwnProperty(i)) { continue; }

      if (!BsObj[i] || typeof BsObj[i] !== 'object') {
        BsObj[i] = ExtObj[i];
      }

      BsObj[i] = Merge(BsObj[i], ExtObj[i]);
    }

    return BsObj;
  }

  Obj = {
    Combine: Combine,
    Dig: Dig,
    Merge: Merge
  };

  if (typeof exports !== 'undefined') { exports = Obj; }
  else if (typeof window !== 'undefined') {
    if (!window.Z || typeof window.Z !== 'object') { window.Z = {Obj: Obj}; }
    else { window.Z.Obj = Obj; }
  }
})();