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
    Merge: Merge
  };

  if (typeof exports !== 'undefined') { exports = Obj; }
  else if (typeof window !== 'undefined') {
    if (!window.Z || typeof window.Z !== 'object') { window.Z = {Obj: Obj}; }
    else { window.Z.Obj = Obj; }
  }
})();