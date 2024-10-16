/*
/**
* AstroChart is the top level class that provides api to draw hindu astrological charts
*
* @author Rajasekar Elango
* @edited for my need kannan
/
*/

(function() {
  var CONSTANTS, Cell, Dimension, Item, Point, addStyleSheet, computeCellLocation, computeHouseNumber, computeHouseNumberLocation, computeHouseSize, computeTitleLocation, drawHouse, drawTitle, formatId, getCellForHouse, getItems, log,
    __modulo = function(a, b) { return (a % b + +b) % b; };

  this.AstroChart = function(elementId) {
    this.elementId = elementId;
    return {
      draw: (function(_this) {
        return function(data, options) {
          var chartSize, houseCell, houseNo, housePosition, houseSize, houseSpacingHeight, houseSpacingWidth, startPosition, svg, _i, _len, _ref, _results;
          svg = Snap(elementId);
          addStyleSheet(elementId, options);
          Point(startPosition = new Point(0, 0));
          chartSize = new Dimension(options.width, options.height);
          svg.rect(startPosition.x, startPosition.y, chartSize.width, chartSize.height).attr({
            "class": 'chart'
          });
          drawTitle(svg, startPosition, chartSize, options.title);
          houseSpacingWidth = CONSTANTS.get('HOUSE_SPACING_WIDTH');
          houseSpacingHeight = CONSTANTS.get('HOUSE_SPACING_HEIGHT');
          houseSize = computeHouseSize(chartSize, houseSpacingWidth, houseSpacingHeight);
          _ref = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            houseNo = _ref[_i];
            Cell(houseCell = getCellForHouse(houseNo));
            Point(housePosition = startPosition.move(houseCell.row * (houseSize.width + houseSpacingWidth), houseCell.col * (houseSize.height + houseSpacingHeight)));
            log("--------");
            log(startPosition);
            log(housePosition);
            _results.push(drawHouse(svg, housePosition, houseSize, houseNo, data[houseNo], options));
          }
          return _results;
        };
      })(this)
    };
  };

  addStyleSheet = (function(_this) {
    return function(elementId, options) {
      var styleData, styleElement, styleSheetUrl, svgElement, _ref;
      svgElement = document.querySelector(elementId);
      styleElement = (_ref = svgElement.getElementsByTagName("style")) != null ? _ref[0] : void 0;
      styleElement = styleElement ? styleElement : document.createElement("style");
      styleElement.setAttribute("type", "text/css");
      styleSheetUrl = options.styleSheet ? options.styleSheet : CONSTANTS.get('DEFAULT_STYLE_SHEET');
      styleData = document.createTextNode(" @import url(" + styleSheetUrl + ")");
      styleElement.appendChild(styleData);
      return svgElement.appendChild(styleElement);
    };
  })(this);

  getCellForHouse = function(houseNo) {
    switch (houseNo) {
      case 1:
        return new Cell(1, 0);
      case 2:
        return new Cell(2, 0);
      case 3:
        return new Cell(3, 0);
      case 4:
        return new Cell(3, 1);
      case 5:
        return new Cell(3, 2);
      case 6:
        return new Cell(3, 3);
      case 7:
        return new Cell(2, 3);
      case 8:
        return new Cell(1, 3);
      case 9:
        return new Cell(0, 3);
      case 10:
        return new Cell(0, 2);
      case 11:
        return new Cell(0, 1);
      case 12:
        return new Cell(0, 0);
      default:
        throw "houseNo should be between 1 and 12";
    }
  };

  getItems = function(data) {
    var items;
    switch ((data != null ? data.length : void 0)) {
      case 1:
        items = [new Item(data[0], new Cell(1, 1))];
        break;
      case 2:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(2, 2))];
        break;
      case 3:
        items = [new Item(data[0], new Cell(0, 1)), new Item(data[1], new Cell(2, 0)), new Item(data[2], new Cell(2, 2))];
        break;
      case 4:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(0, 2)), new Item(data[2], new Cell(2, 0)), new Item(data[3], new Cell(2, 2))];
        break;
      case 5:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(0, 2)), new Item(data[2], new Cell(2, 0)), new Item(data[3], new Cell(2, 2)), new Item(data[4], new Cell(1, 1))];
        break;
      case 6:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(0, 1)), new Item(data[2], new Cell(0, 2)), new Item(data[3], new Cell(2, 0)), new Item(data[4], new Cell(2, 1)), new Item(data[5], new Cell(2, 2))];
        break;
      case 7:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(0, 1)), new Item(data[2], new Cell(0, 2)), new Item(data[3], new Cell(2, 0)), new Item(data[4], new Cell(2, 1)), new Item(data[5], new Cell(2, 2)), new Item(data[6], new Cell(1, 1))];
        break;
      case 8:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(0, 1)), new Item(data[2], new Cell(0, 2)), new Item(data[3], new Cell(2, 0)), new Item(data[4], new Cell(2, 1)), new Item(data[5], new Cell(2, 2)), new Item(data[6], new Cell(1, 0)), new Item(data[7], new Cell(1, 2))];
        break;
      case 9:
        items = [new Item(data[0], new Cell(0, 0)), new Item(data[1], new Cell(0, 1)), new Item(data[2], new Cell(0, 2)), new Item(data[3], new Cell(1, 0)), new Item(data[4], new Cell(1, 1)), new Item(data[5], new Cell(1, 2)), new Item(data[6], new Cell(2, 0)), new Item(data[7], new Cell(2, 1)), new Item(data[8], new Cell(2, 2))];
    }
    return items;
  };

  drawHouse = function(svg, housePosition, houseSize, houseNumber, data, options) {
    var cellPosition, houseNumberLocation, item, items, point, scaledSize, startHouseNumbersFrom, styleClass, _i, _len;
    svg.rect(housePosition.x, housePosition.y, houseSize.width, houseSize.height).attr({
      "class": 'house'
    });
    Dimension(scaledSize = houseSize.scale(CONSTANTS.get('CELL_WIDTH_OFFSET_PERCENT'), CONSTANTS.get('CELL_HEIGHT_OFFSET_PERCENT')));
    Point(cellPosition = housePosition.move(scaledSize.width, scaledSize.height));
    items = getItems(data);
    if (items != null) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        point = computeCellLocation(cellPosition, houseSize, item.cell);
        styleClass = /~R$/.test(item.text) ? 'house retrograde' : 'house';
        svg.text(point.x, point.y, item.text).attr({
          "class": styleClass,
          id: formatId(item.text)
        });
      }
    }
    Point(houseNumberLocation = computeHouseNumberLocation(housePosition, houseSize));
    if (options.showHouseNumbers) {
      startHouseNumbersFrom = options.startHouseNumbersFrom ? options.startHouseNumbersFrom : 1;
      svg.text(houseNumberLocation.x, houseNumberLocation.y, computeHouseNumber(houseNumber, startHouseNumbersFrom)).attr({
        "class": 'houseNumber'
      });
    }
    
    // Add Tamil Rasi name
    var rasiName = CONSTANTS.get('TAMIL_RASI_NAMES')[houseNumber - 1];
    var rasiText = svg.text(housePosition.x + 5, housePosition.y + 20, rasiName).attr({
      "class": 'rasiName',
      fill: 'red',
      'font-size': '12px'
    });
    rasiText.transform('r-0,' + (housePosition.x + 5) + ',' + (housePosition.y + 20));
  };

  drawTitle = function(svg, chartPosition, chartSize, title) {
    var text, titlePosition;
    Point(titlePosition = computeTitleLocation(chartPosition, chartSize));
    text = svg.text(titlePosition.x, titlePosition.y, title).attr({
      "class": 'title'
    });
    return text.selectAll("tspan:nth-child(n+2)").attr({
      dy: "1.2em",
      x: titlePosition.x
    });
  };

  computeHouseNumberLocation = function(housePosition, houseSize) {
    var position, scaledSize;
    Dimension(scaledSize = houseSize.scale(CONSTANTS.get('HOUSE_NUMBER_WIDTH_OFFSET_PERCENT'), CONSTANTS.get('HOUSE_NUMBER_HEIGHT_OFFSET_PERCENT')));
    Point(position = housePosition.move(scaledSize.width, scaledSize.height));
    return position;
  };

  computeHouseNumber = function(houseNumber, startHouseNumbersFrom) {
    return (__modulo(houseNumber - startHouseNumbersFrom, 12)) + 1;
  };

  computeCellLocation = function(cellPosition, houseSize, cell) {
    var cellHeight, cellWidth, point;
    cellWidth = houseSize.width / CONSTANTS.get('CELL_TOTAL_ROWS');
    cellHeight = houseSize.height / CONSTANTS.get('CELL_TOTAL_COLS');
    point = cellPosition.move(cell.row * cellWidth, cell.col * cellHeight);
    log(point);
    return point;
  };

  computeTitleLocation = function(chartPosition, chartSize) {
    var offset;
    offset = chartSize.scale(0.5, 0.5);
    return chartPosition.move(offset.width, offset.height);
  };

  computeHouseSize = function(chartSize, houseSpacingWidth, houseSpacingHeight) {
    return new Dimension((chartSize.width - (3 * houseSpacingWidth)) / 4, (chartSize.height - (3 * houseSpacingHeight)) / 4);
  };

  formatId = function(text) {
    return text.replace(/\s+/g, "_");
  };

  log = function(msg) {
    return CONSTANTS.get('DEBUG') && console.log(msg);
  };

  Cell = (function() {
    function Cell(row, col) {
      this.row = row;
      this.col = col;
    }

    return Cell;

  })();

  CONSTANTS = (function() {
    var private_;
    private_ = {
      DEBUG: false,
      HOUSE_SPACING_WIDTH: 5,
      HOUSE_SPACING_HEIGHT: 5,
      CELL_WIDTH_OFFSET_PERCENT: 0.05,
      CELL_HEIGHT_OFFSET_PERCENT: 0.25,
      CELL_TOTAL_ROWS: 3,
      CELL_TOTAL_COLS: 3,
      DEFAULT_STYLE_SHEET: "../dist/themes/default.css",
      HOUSE_NUMBER_WIDTH_OFFSET_PERCENT: 0.85,
      HOUSE_NUMBER_HEIGHT_OFFSET_PERCENT: 0.15,
      TAMIL_RASI_NAMES: [
        "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", 
        "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", 
        "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
      ]
    };
    return {
      get: function(name) {
        return private_[name];
      }
    };
  })();

  Dimension = (function() {
    function Dimension(width, height) {
      this.width = width;
      this.height = height;
    }

    Dimension.prototype.scale = function(x, y) {
      return new Dimension(this.width * x, this.height * y);
    };

    return Dimension;

  })();

  Item = (function() {
    function Item(text, cell) {
      this.text = text;
      this.cell = cell;
    }

    return Item;

  })();

  Point = (function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    Point.prototype.move = function(x, y) {
      return new Point(this.x + x, this.y + y);
    };

    return Point;

  })();

}).call(this);
