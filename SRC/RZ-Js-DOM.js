(function Z_DOM_API () {
  'use strict';

  var DOM;

  /* Extend some function to any Element to simulate JQuery DOM Traveler. */
  function Initialize () {
    //==== cross browser handle. ====

    // handle console.log function of global object.
    if (!console || typeof console !== 'object') { console = {'log': function (Msg) {}}; }
    else if (!console.log || typeof console.log !== 'function') { console.log = function (Msg) {}; }

    // handle indexOf function of array.
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (Data) {
        for (var i = 0; i < this.length; i++) {
          if (Data === this[i]) { return true; }
        }

        return false;
      };
    }

    //==== extend functions. ====

    NodeList.prototype.ToArray = function () {
      var DA = []; // 'DA' = Data Array.

      for (var i = this.length; i--; DA.unshift(this[i]));

      return DA;
    };

    /* chainable.
      'Fctn(Obj, Idx)' = Function.
        'Obj' = each item of array.
        'Idx' = Index of item in array.
        'Lth' = Length of array.
        Return: false to end loop immediately.
      Return: array itself as OK, null as error. */
    Array.prototype.Each = function (Fctn) {
      if (typeof Fctn !== 'function') { return null; }

      for (var i = 0; i < this.length; i++) {
        var Rst = Fctn(this[i], i, this.length);

        if (typeof Rst === 'boolean' && !Rst) { break; }
      }

      return this;
    };

    /*
      'Fctn(Obj, Idx)' = Function.
        'Obj' = each item of array.
        'Idx' = Index of item in array.
        'Lth' = Length of array.
        Return: true to save item, or false to drop it.
      Return: new array the items saved, or [] otherwise. */
    Array.prototype.Some = function (Fctn) {
      var PckA = []; // 'PckA' = Picked item Array.

      for (var i = 0; i < this.length; i++) {
          var Rst = Fctn(this[i], i, this.length);

          if (typeof Rst === 'boolean' && Rst) { PckA.push(this[i]); }
      }

      return PckA;
    };

    /*
      'SltrStr' = Selector String.
      Return: nodes array, or []. */
    Element.prototype.Find = function (SltrStr) {
      if (typeof SltrStr !== 'string' || SltrStr.length === 0) { return []; }

      return this.querySelectorAll(SltrStr).ToArray();
    };

    /*
      Return: first child node. */
    Element.prototype.FirstChild = function () {
      var Elt = this.firstChild;

      while (Elt && Elt.nodeType !== 1) { Elt = Elt.nextSibling; }

      return Elt;
    };

    /*
      Return: last child node. */
    Element.prototype.LastChild = function () {
      var Elt = this.lastChild;

      while (Elt && Elt.nodeType !== 1) { Elt = Elt.previousSibling; }

      return Elt;
    };

    /* find Above (parent) node of current node.
      'Lv' = Level to source up. optional, default: 1.
      Return: parent node, or document node as top level node. */
    Element.prototype.Above = function (Lv) {
      var PrtNd = this.parentNode;

      if (typeof Lv !== 'number' || Lv < 1) { Lv = 1; }

      Lv = Math.floor(Lv);

      for (var i = 1; (i < Lv) && (PrtNd !== document); i++) { PrtNd = PrtNd.parentNode; }

      return PrtNd;
    };

    /*
      'SltrStr' = filter Selector String. optional.
      Return: children nodes array, or []. */
    Element.prototype.Children = function (SltrStr) {
      var NdA = this.childNodes,
          RstNdA = [];

      for (var i = 0; i < NdA.length; i++) {
        if (NdA[i].nodeType === 1) { RstNdA.push(NdA[i]); }
      }

      if (SltrStr && typeof SltrStr === 'string') {
        var SltrNdA = [], // 'SltrNdA' = Selector matched Nodes array.
            OrgID = this.id; // 'OrgID' = Original ID.

        if (!this.id) {
          var Dt = new Date();

          this.id = 'TmpID' + Dt.getTime().toString();
        }

        SltrStr = '#' + this.id + ' > ' + SltrStr;
        NdA = document.querySelectorAll(SltrStr);

        for (var i = 0; i < NdA.length; i++)         {
          if (NdA[i].nodeType === 1) { SltrNdA.push(NdA[i]); }
        }

        if (SltrNdA.length === 0) { return []; }

        NdA = [];

        for (var i = 0; i < RstNdA.length; i++) {
          for (var j = 0; j < SltrNdA.length; j++) {
            if (RstNdA[i] === SltrNdA[j]) {
              NdA.push(RstNdA[i]);

              break;
            }
          }
        }

        if (OrgID !== this.id) { this.id = OrgID; }

        RstNdA = NdA;
      }

      return RstNdA;
    };

    Element.prototype.Prev = function () {
      var Nd = this.previousSibling;

      while (Nd && Nd.nodeType !== 1) { Nd = Nd.previousSibling; }

      return Nd;
    };

    Element.prototype.Next = function () {
      var Nd = this.nextSibling;

      while (Nd && Nd.nodeType !== 1) { Nd = Nd.nextSibling; }

      return Nd;
    };

    /*
      'SltrStr' = filter Selector String. optional.
      Need: Children(). */
    Element.prototype.Siblings = function (SltrStr) {
      var NdA = this.parentNode.Children(SltrStr);

      for (var i = 0; i < NdA.length; i++) {
        if (NdA[i] === this) {
          NdA.splice(i, 1);

          break;
        }
      }

      return NdA;
    };

    Element.prototype.Append = function (Elt) {
      this.appendChild(Elt);

      return this;
    };

    Element.prototype.Prepend = function (Elt) {
      this.appendChild(Elt);
      this.insertBefore(Elt, this.firstChild);

      return this;
    };

    Element.prototype.Process = function (Fctn) {
      Fctn(this);

      return this;
    };

    Element.prototype.Index = function (SltrStr) {
      var NdA = this.Above().Children(SltrStr);

      for (var i in NdA) {
        if (NdA[i] === this) { return i; }
      }

      return -1;
    };

    Element.prototype.Remove = function () {
      this.Above().removeChild(this);

      return this;
    };

    Element.prototype.AddEvent = function (EvtStr, Fctn) {
      if (!EvtStr || typeof EvtStr !== 'string' || !Fctn || typeof Fctn !== 'function') { return null; }

      this.addEventListener(EvtStr, Fctn);

      return this;
    };


    /* Not Yet. */
    Element.prototype.Attr = function (Attr, Val) {
    };

    Event.prototype.Element = function () {
      return (this.srcElement && !this.target) ? this.srcElement : this.target;
    };
  }

  //==== define global Z object with useful functions. ====

  /* Extend some function to any Element to simulate JQuery Selector.
    'ES' = Element object or Selector string.
    Return: node array, or null as empty; */
  function Find (ES) {
    var Tp = typeof ES,
        NdA = null; // 'NdA' = Node Array.

    if (Tp === 'object' && ES.tagName !== 'undefined' && ES.nodeType === 1) { NdA = [ES]; }
    else if (Tp === 'string') { NdA = document.querySelectorAll(ES).ToArray(); }
    else { NdA = null; }

    return NdA;
  }

  function NewNode (TgNm) {
    return document.createElement(TgNm);
  };

  DOM = {
    Find: Find,
    NewNode: NewNode,
    Initialize: Initialize
  };

  if (typeof window !== 'undefined') {
    if (!window.Z || typeof window.Z !== 'object') { window.Z = {DOM: DOM}; }
    else { window.Z.DOM = DOM; }

    DOM.Initialize();
  }
})();
