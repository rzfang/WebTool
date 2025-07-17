(function Z_Obj_API () {
  /* Combine the seconde object into first object.
    @ Base Object.
    @ Extend Object.
    @ Mode, 0: always create another object, 1: overwrite the BsObj.
    < new object after combined, or null as error.
    Note: this is not perfect. */
  function Combine (BsObj, ExtObj, Md) {
    let RstObj;

    if (typeof BsObj !== 'object' || typeof ExtObj !== 'object') { return null; }

    if (!Md) {
      RstObj = {};

      for (const i in BsObj) { RstObj[i] = BsObj[i]; }
    }
    else { RstObj = BsObj; }

    for (const i in ExtObj) { RstObj[i] = ExtObj[i]; }

    return RstObj;
  }

  /* dig the children of given object.
    @ Object. the origin object which will be digged.
    @ Path. an array records each level of path.
    @ Fallback. optional, default undefined.
    < sub object, or fallback value. */
  function Dig (Obj, Pth, Flbck) {
    let Chld = Obj;

    if (!(Pth instanceof Array) || Pth.length === 0) { return Flbck; }

    if (!Obj || typeof Obj !== 'object') { return Flbck; }

    for (let i = 0; i < Pth.length; i++) {
      if (!Chld || !Object.prototype.hasOwnProperty.call(Chld, Pth[i])) { return Flbck; }

      Chld = Chld[Pth[i]];
    }

    return Chld;
  }

  /* Merge the seconde object into first object.
    @ Base Object.
    @ Extend Object.
    < BsObj after merge with ExtObj.
    Note: this is not perfect. */
  function Merge (BsObj, ExtObj) {
    if (BsObj === ExtObj || typeof ExtObj !== 'object' || ExtObj === null) { return ExtObj; }

    if (!BsObj || typeof BsObj !== 'object') {
      BsObj = JSON.parse(JSON.stringify(ExtObj));

      return BsObj;
    }

    for (const i in ExtObj) {
      if (!Object.prototype.hasOwnProperty.call(ExtObj, i)) { continue; }

      if (!BsObj[i] || typeof BsObj[i] !== 'object') {
        BsObj[i] = ExtObj[i];
      }

      BsObj[i] = Merge(BsObj[i], ExtObj[i]);
    }

    return BsObj;
  }

  function Clone (Obj) {
    return Merge(null, Obj);
  }

  const Obj = {
    Combine: Combine,
    Dig: Dig,
    Merge: Merge,
    Clone: Clone,
  };

  if (typeof module !== 'undefined') { module.exports = Obj; }
  else if (typeof window !== 'undefined') {
    if (!window.Z || typeof window.Z !== 'object') { window.Z = {Obj: Obj}; }
    else { window.Z.Obj = Obj; }
  }
})();
