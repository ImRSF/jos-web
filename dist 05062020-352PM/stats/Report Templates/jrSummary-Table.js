"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJRSummaryTable = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const getJRSummaryTable = function getJRSummaryTable() {
  let filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  $("#table-jobRequest-summary").DataTable({
    destroy: true,
    dom: "Bfrtip",
    buttons: ["excel", "pdf", {
      extend: "print",
      autoPrint: false
    }],
    ajax: {
      url: "/stat/jrSummary",
      method: "GET",
      dataSrc: "data",
      data: {
        filters: _objectSpread({}, filters)
      }
    },
    columns: [{
      data: "RequestNumber"
    }, {
      data: "RequestedByName"
    }, {
      data: "ApprovedByName"
    }, {
      data: "DateSent",
      render: function render(getDate) {
        if (getDate) {
          return getDate.substring(0, 10);
        }

        return "";
      }
    }, {
      data: "DateApproved",
      render: function render(getDate) {
        if (getDate) {
          return getDate.substring(0, 10);
        }

        return "";
      }
    }, {
      data: "StatusName"
    }]
  });
};

exports.getJRSummaryTable = getJRSummaryTable;