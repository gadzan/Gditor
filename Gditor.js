/*
gihub地址: https://github.com/gadzan/Gditor

- 文章为txt格式，默认保存到JSbox本地共享目录
- 支持Markdown快捷键输入
- 支持在文章页转换markdown为html并导出pdf
- 支持导出txt格式文件
- 支持分词，可选中区域长按空白处分词
- 支持sm.ms图床
- 支持设置段前空格,隔行输入
- 支持自动保存
- 支持导入.txt .zip文件

*/
const
  version = 1.12,
  localImageFolder = "shared://imageStocker/",
  configFilePath = "drive://gditor.json",
  DARKBG = $color("#111111"),
  GRAY = $color("AAAAAA"),
  DARKFT = $color("CCCCCC"),
  WHITE = $color("FFFFFF")
  returnBtnIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzU4QzZGMjJGQjQyMTFFNzk2RjRCMzIxMjc1MjYxNjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzU4QzZGMjNGQjQyMTFFNzk2RjRCMzIxMjc1MjYxNjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNThDNkYyMEZCNDIxMUU3OTZGNEIzMjEyNzUyNjE2MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNThDNkYyMUZCNDIxMUU3OTZGNEIzMjEyNzUyNjE2MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pogbd5AAAADqSURBVHjaYvz//z8DLQETA40BzS1gwSeZmJjIA6S2A/G3+fPnu1PVB1DD9wKxDRBzUDWIkAw3A+JzQOxLNQuwGO4IDJ5P5FrAiJxM0QwHAX5KDMdmwUsgJYYk/40IM0BqTgFxP9Axe2iRTLmA2AuINwIdWEFqEAkCXfWBQFJmA1JxQNwNTfagODuD1QdAiS9AyhnqZRDYCzRAAJ8FQD2/gHgOkFkLxCAHNuINIjRLjIixBArmQOPDhGAcYLFkIyHTgXp+QJk8REUykiVHgPgHTcoiqCW2I7u4HuYVDhngCN6iYjQOsAGAAAMAqK5dYjN94HUAAAAASUVORK5CYII=",
  saveIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAEJQTFRF////+Pj4dXV1GRkZAAAANDQ06enpLCwsxcXF6urqLS0tKCgo5ubmPDw8xMTEwsLCGhoad3d3eXl5+fn5dnZ2eHh4y6Nz0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAEgAAABIAEbJaz4AAABuSURBVCjPvdJLDoAgDATQKgP4Q1H0/lc1IilFXbFwVtAX2jSBqCJNq5CjDUOLIpZFoSMgXYzNchUZqB8wTl8g5IYUF7tpBieATHov2oip1eAgxwuQqz9AtvkRFOYSFvh4XPHKFiHsviz7I9R8kRMFJgSRobz/hgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wMS0yNVQxMTowOTozMS0wNTowMM9OuAcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDEtMjVUMTE6MDk6MzEtMDU6MDC+EwC7AAAAe3pUWHRzdmc6YmFzZS11cmkAAAjXXcxBDoIwEEDRE5UpIiJuTbxHU2egWDrQKdPrG3fE7U/epxDxAQDqMtRaQWeWIkAZ0XhOirlgbjyvwETB/8dji+zeAtcjxeUTOk3lpoPd5LLuhLynFl6/1fOsjDhFM957a8eubUSnLyM6MIqfu3ucAAAAAElFTkSuQmCC",
  listIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADCSURBVGiB7dZNCsIwGIThV4+hiKAXEa/sz04E8Vhi3VhoJdImxnRK54FAoSF80yw6YGaxrkAlvi6fQ88CQar0b1BUa/b5UFPk5iBqHETNpIMcgQ2wBc55x8mr62e0auxdB97vMs2x75ijJeVGnl+ea4+EM0N+PqfrRg7AAlgCpx77/7VaXFHUOIgaB1Ez6SCuKJFcUWquKIW5okhzEDUOosYV5c0VpQdXlGaQMXBFkeYgahxETSjIvfgU8W5DD2A2Ni9G6PFswBbihwAAAABJRU5ErkJggg==",
  codeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAc1gAAHNYBTCInoQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK/SURBVGiB7ZnJaxRBFIe/TFTEixo0MW6IJ0GFQE4SBBXRk8Zt9KKiV0EJgv4B3kUMhKAHl7MKRiMIohchICSecvCkgjoEJCKMCaLieKhpqXld1V29zdL0B32oV6+qfm/61TYNBQUFBZ1EV0DdYeAssB5Y1hw5Vn4BX4D7wGSUhqNArU2fG65BnGgDsWHPUSm6ZAjknGvELeS8NJgC2dwEIUnZIg2mQEy2dsOnsRNEO5GbQJY4+EwA77IWEsI2YDhqo1kal7pyyqLiUKZR06x0yE1q5SYQlzmSlBKwT9imgMU0B2lGIAPAC61cBXrSHiRJag06+u0W5TfAn4R9+ogbSBmYBh4Aa0N8ZVq9Mvj0o47n06hDayqELb89QEWr/wwcsPRVAuZFf0PC5yDqruHVV/CnXibL7x3UL+ixAei1+A4IUVVUaun0oi5vHv31MRIT9EZO4b8bPA7o67LwfW7xmzD0e1KrT/WNrAFuCtsPYCSgjZzory1+I8CCsI3Wx3QiSiDjQJ+wXQE+Wvy7gb3CZproAB/qfen0AdddxbkG0gWsMtjnA9rsAFZq5UVgJsC/YrCFrYj/cQ2kBpwBvgr7LWCTpc0eUZ5C/RtiYjXqjetUgQuO+iKl1hxwGhWULuARsNTg77J/eIzRuBICXMSetk6E7SPj+FeYa8KnG/gufHZZxjtm6O+h8MlkH7kKvNfKv4GfwifK/FiBSiOPb8ClGLp8uFysBlH5/hbYbqh33T881qFStAYcMdSHvpG4p98Z4DjwEvNx3HX/8JhDnbH203hSdibJMf6pxR5l/9CpETMIyOY+shw1j3SC9o9UyCKQBeB2Bv0Gkps7e24CMaXWX1EeBrY2QUsQO0VZajQySeu/f4Q9T6RoU2rdc4m2xdx1dey4T29BH0MPoQ50G12jz5hPqGPMs1YLKSgoKEjOP5drRoMmBnR6AAAAAElFTkSuQmCC",
  boldIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJHSURBVGiB7dhNiE9RGMfxz8iMSGkyVjJZotSkFFnIEgvysmFlIdnKhpQVGyU7IisbyWYWXkpmQYmSl4WaJMnG62YYNN7G4szUUO597jj/uVfdX53V+Z3nnu///p/7POfQqlWrInUFPP04iQUZnvcNoxjBRwxPjPv4nCF+ofZhvMPjC65jN2Z1CmT/DIBMHQ+xuuomO0b/DxrAbeyssqiJIDAHF7AiuqCpICSY84J7bDIIrMHGiHF2xoe+wM+C+V7pE171x9uGK9Pc02+KfrV6g/H6cQgfgnEf54AgP8iklkmFsSzu20iwOnNkGKcCvoUCKVB3sg8FfUW5h/pBRgKe9/4DkMUBTyjZ6waJtCGDuR7Wqa/WDvwoiflO8PiQsyAuVQ7TjZXYha3Kz0MHxPIopJlu4yfH0SqbzPlGcuoIjlVZUHey/02HcVCF/TUVZB5O4BJ6IguaCjKp7TgTMebMkUF8LfHMnxjL0ReMuweXcXX6W0vqRB3pwnrpGmjGWvlOFUTScfZGMP6qokB158gY9koVvkybiybrBiEdkR8EfIV3XU0AgacBT2Gn3BSQyF+rsHlsCsiSgGesaLIJIIuwLuB7UzRZN0g3zom1IU+KJusC6cEm6bJ6S3DNzaLJnC3KkPKk7ZL+Sn2YWyH2a1wrMuQEGcgY608d9x8ke5nu4HSZqekgz6VLiu9lxiaDPMIGvIqYmwgyKh111+JldFEk2cenu6OKGsZFnBV8C1MVAbmFu1LxyqUxfMIz6XB1T0nBa9WqVSvwCwxg/HNlkKnDAAAAAElFTkSuQmCC",
  hashIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAangAAGp4B8NQjJQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHnSURBVGiB7dm7ahVRGMXxX068gBcStQmoKFpEPRgFC1sb8QkEX0BfwTJgl1fQB7CwVhQbW0sVsYoIwU48B8SAitFChHiyL84ZM5kZ9x92831Zc9baZM9lbwqFwn/BTA3tPM5j76baB7zERkY7wAUc2VT7glcY1/BUmSFG+BEYD6UnaAaPItoRzm2b6wDLESO/x7GE9nhGuzyNocE0IuzL9PfX0Ob6QaYN0jpKkLbRmyC7Er2LuIFDgd7lzHXviD8P5jPaa5G/GeE+XmT0W35sLH2b3IkxjoSM/mudwVyV5A0x55e3LcSCzG6fl9oEvfVmsfc+yKdGXVSjkrdZPLHzd6nJ8Vhk8lOv2wMcxe5A7zZuJbRX8TbSO4WnCe1drATq3/Be5Fsn9UDcwFqkl/v4WRMPEpqYyWvHtFF6v9g7RwnSNnoTJHXXGuCk8Gv8Qua6QxyI9E5ktAu4FKiP8E5+q+kPOvdAjLHUAtOxsRQyHEt3sErqhgl6681i732Q7426qEYlb53bfEi9xp/FdeG92CvSW0L38DHSO4ybCe1zPAvU1/EAbxLayqxIz9xiQruY0Ya+RbL0frF3jhKkbUwbZD3T/1xDm+v/U1p3GFr3ePr0RO0rXvu74+kh9kzUVzV8PF0oFDrGTzEIJyUbHiEOAAAAAElFTkSuQmCC",
  quoteIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEPSURBVGiB7ZcxTsNAFEQfiIYyLUrHAVIhpeIONEiUnJETBCkNFQ0STRoUyAGo3OAUpHBj8pn12h80T1rJxde8HVlae8EYY4wxnHSe24rZXap4TgcOnQwXyYaLZMNFsuEi2XCRbLhINlwkGy6SDRfJRt+9+hiRe7eaLXn+zRtRipwHZj6F3CKPUuQiMPMh5BZ5lCLLwMy7kFvkUYrcBWYehdxRPVfAF9+nyU9roQrG8MyBTSD8paRBTc8MuAd2gfAWuBELVPVEArtrjfYhrO75TfiW2JE5iSca3gDXYolRPJHwHbEzf1LPsfAn4FLe/oievuBX4JZh/nAH8ZwFJA3wdlgr4AF41vabwmOM+cvsAY9yzh+YGaVGAAAAAElFTkSuQmCC",
  transIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIuSURBVGiB7dk9jAxhHMfxz97hSBARcQ2JEIWXSHQUKKhFwkk0p0IlCgmtzkunEC6RSEQhp1AoJIjoNEdUlyhE4yQoTkgOwVKMSXbPzfuYmXX7Tf7F7DzPzO+bnX2eZ56lT595x2aM1h2iKLsxjV+4UHOW3BzEV4FEWDewoM5QWTmGH7olwrqLxfVFS89ZtM0tEdZjLK8rYBIDuCxeoLMmsLqWpDEsxE3pJcJ6hQ015J2TJbgnu0RYb7EtvFirwuCzOY59sz4bSejzFG86jt/jDGZKzFUKSd9CpOhAFemqYN6K7MBVTOKD/D/UsMYLG/wh7bS/DNdwRL0DRCRpRFbhCbb82yjFSHq0Writ4RIki4xibxVBipIkcqqSFCUQJ7IW26sKUpQ4kY2VpSiBuFFrZYr+zwWvotM57/8uZ7+/iBNJM18cwuuSshSi6BKlTIn1Kdp8jjpR5gv9TqzJ2XcRTqdoN5Xn4iOS10qdjKdoX6Q+YSgqbC+tfu/jW9TJXhFp43xcg14RuYUXcQ16QeQZTiQ1arrIBA4ItlBjaarIF8GKYZfuXZNImrIx/FMQeBIPcEfGOaNMkcMlXiszTX20MvPfiISP1gpc0b3LPZyi/8NZx49wsYRchViHl/Kvha5jsOrQUQwLJqCsEpc0cL9rqWAITCPQ1vANiiHBWB4n8V2P/H08iDFzS8xgf33RstPCOd0SH7GnxkyFOClYRkxha81ZCnMUm+oO0adPxfwGpeDhoHdZz1oAAAAASUVORK5CYII="
var localDataFolder = "shared://gditor/";
!$file.isDirectory(localDataFolder) ? $file.mkdir(localDataFolder) : false;
!$file.isDirectory(localImageFolder) ? $file.mkdir(localImageFolder) : false;
var config = $file.read(configFilePath),
  curPath = "",
  oldLinesNum = 0,
  folderMode = false,
  screenWidth = $device.info.screen.width,
  screenHeight = $device.info.screen.height;
var configTamplate = {
  tabSpace: true,
  tabSpaceNum: 2,
  interlaced: false,
  autoSaver: true,
  darkMode: false,
  editorFontSize: 17,
};
if (config) {
  var LocalConfig = JSON.parse(config.string);
  for (key of Object.keys(configTamplate)) {
    if (!LocalConfig.hasOwnProperty(key)) {
      LocalConfig[key] = configTamplate[key];
      var newConfigFlag = true;
    }
  }
  newConfigFlag ? saveConfig() : false;
} else {
  var LocalConfig = configTamplate;
  saveConfig()
};
var chapters = []; //$file.list(localDataFolder);
!$cache.get("fileListOrder") ? $cache.set("fileListOrder", {}) : false;
const listTemplate = [{
    type: "image",
    props: {
      id: "listIcon",
      bgcolor: $color("clear"),
      radius: 5
    },
    layout: function(make, view) {
      make.size.equalTo($size(24, 24))
      make.centerY.equalTo(view.super)
      make.left.inset(15)
    }
  },
  {
    type: "label",
    props: {
      id: "textTitle",
      //bgcolor: DARKBG,
      //textColor: DARKFT,
      //font: $font("bold", 18),
      autoFontSize: true
    },
    layout: function(make, view) {
      make.left.equalTo(view.prev.right).offset(10)
      make.height.equalTo(18)
      make.centerY.equalTo(view.super)
      make.right.inset(5)
    }
  }
]

const tabEveryLineSwitch = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        id: "tabEveryLineLabel",
        text: "段前空格"
      },
      layout: function(make, view) {
        make.left.inset(15);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "switch",
      props: {
        id: "tabSpaceChecker",
        on: LocalConfig.tabSpace
      },
      layout: function(make, view) {
        make.right.inset(15);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          LocalConfig.tabSpace = sender.on;
          $("tabEveryLineLabel").textColor = sender.on ? $color("#000000") : $color("#AAAAAA");
          saveConfig()
        }
      }
    }
  ],
  layout: $layout.fill
}

const tabEveryLineNum = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        text: "段前空格数"
      },
      layout: function(make, view) {
        make.left.inset(15);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "stepper",
      props: {
        id: "tabSpaceNumStepper",
        min: 0,
        value: LocalConfig.tabSpaceNum,
        tintColor: $color("#666666")
      },
      layout: function(make, view) {
        make.right.inset(15);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          sender.next.text = sender.value;
          LocalConfig.tabSpaceNum = parseInt(sender.value);
          saveConfig();
        }
      }
    },
    {
      type: "label",
      props: {
        id: "tabSpaceNumLabel",
        text: LocalConfig.tabSpaceNum.toString(),
        color: $color("#666666")
      },
      layout: function(make, view) {
        make.centerY.equalTo(view.super)
        make.right.equalTo(view.prev.left).offset(-10)
      }
    }
  ],
  layout: $layout.fill
}

const editorTextSize = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        text: "编辑器字体大小"
      },
      layout: function(make, view) {
        make.left.inset(15);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "stepper",
      props: {
        id: "editorFontSizeStepper",
        min: 0,
        value: LocalConfig.editorFontSize,
        tintColor: $color("#666666")
      },
      layout: function(make, view) {
        make.right.inset(15);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          sender.next.text = sender.value;
          LocalConfig.editorFontSize = parseInt(sender.value);
          saveConfig();
        }
      }
    },
    {
      type: "label",
      props: {
        id: "editorFontSizeLabel",
        text: LocalConfig.editorFontSize.toString(),
        color: $color("#666666")
      },
      layout: function(make, view) {
        make.centerY.equalTo(view.super)
        make.right.equalTo(view.prev.left).offset(-10)
      }
    }
  ],
  layout: $layout.fill
}

const autoSaverSwitch = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        id: "autoSaverLabel",
        text: "编辑时自动保存"
      },
      layout: function(make, view) {
        make.left.inset(15);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "switch",
      props: {
        id: "autoSaverChecker",
        on: LocalConfig.tabSpace
      },
      layout: function(make, view) {
        make.right.inset(15);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          LocalConfig.autoSaver = sender.on;
          $("autoSaverLabel").textColor = sender.on ? $color("#000000") : $color("#AAAAAA");
          saveConfig()
        }
      }
    }
  ],
  layout: $layout.fill
}

const interlacedSwitch = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        id: "interlacedLabel",
        text: "隔行输入"
      },
      layout: function(make, view) {
        make.left.inset(15);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "switch",
      props: {
        id: "interlacedChecker",
        on: LocalConfig.interlaced
      },
      layout: function(make, view) {
        make.right.inset(15);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          LocalConfig.interlaced = sender.on;
          $("interlacedLabel").textColor = sender.on ? $color("#000000") : $color("#AAAAAA");
          saveConfig()
        }
      }
    }
  ],
  layout: $layout.fill
}

const importFilesSetting = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        id: "interlacedLabel",
        text: "导入文章"
      },
      layout: function(make, view) {
        make.left.inset(15);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "switch",
      props: {
        id: "interlacedChecker",
        on: LocalConfig.interlaced
      },
      layout: function(make, view) {
        make.right.inset(15);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          LocalConfig.interlaced = sender.on;
          $("interlacedLabel").textColor = sender.on ? $color("#000000") : $color("#AAAAAA");
          saveConfig()
        }
      }
    }
  ],
  layout: $layout.fill
}

const feedBackTemplate = [{
  type: "label",
  props: {
    id: "feedbackTitle"
  },
  layout: function(make, view) {
    make.left.inset(15);
    make.centerY.equalTo(view.super);
  }
}, {
  type: "label",
  props: {
    id: "feedbackDetails",
    textColor: $color("#AAAAAA")
  },
  layout: function(make, view) {
    make.right.inset(15);
    make.centerY.equalTo(view.super);
  },
  events: {
    tapped: function(sender, indexPath, item) {

    }
  }
}]

const feedbacksArray = [{
  feedbackTitle: {
    text: "邮件"
  },
  feedbackDetails: {
    text: "gadzan@qq.com"
  },
  url: "mailto:gadzan@qq.com"
}, {
  feedbackTitle: {
    text: "Telegram"
  },
  feedbackDetails: {
    text: "@gadzan"
  },
  url: "http://t.me/gadzan"
}, {
  feedbackTitle: {
    text: "微博"
  },
  feedbackDetails: {
    text: "@gadzan"
  },
  url: "weibo://userinfo?uid=gadzan"
}]

const settingListView = {
  type: "list",
  props: {
    id: "settingList",
    title: "编辑器",
    template: feedBackTemplate,
    data: [{
        title: "编辑器设置",
        rows: [
          tabEveryLineSwitch,
          tabEveryLineNum,
          interlacedSwitch,
          autoSaverSwitch,
          editorTextSize
        ]
      },
      {
        title: "其他设置",
        rows: [
          "导入文章",
          "清除缓存",
          "加密 - 正在开发中..."
        ]
      },
      {
        title: "反馈",
        rows: feedbacksArray
      }
    ],
    footer: {
      type: "label",
      props: {
        height: 40,
        text: `Version:${version} ©️Gadzan`,
        textColor: $color("#AAAAAA"),
        align: $align.center,
        font: $font(12)
      }
    }
  },
  layout: function(make, view) {
    make.size.equalTo(view.super)
  },
  events: {
    didSelect: function(sender, indexPath, title) {
      if (title == "导入文章") {
        listInboxFiles()
      } else if (title == "清除缓存") {
        $ui.action({
          title: "清除缓存",
          message: "确认清除全部缓存？并不会清除文件",
          actions: [{
            title: "确认",
            handler: function() {
              $cache.clear()
              $ui.toast("缓存已清除")
            }
          }]
        })
      } else if (title.feedbackTitle.text) {
        $app.openURL(title.url)
      }
    }
  }
}

const settingPage = {
  name: "settingPage",
  page: {
    props: {
      title: "设置"
    },
    views: [
      settingListView
    ]
  }
}

const imageStocker = {
  type: "matrix",
  props: {
    id: "imageStocker",
    columns: 4,
    spacing: 3,
    square: true,
    template: [{
      type: "image",
      props: {
        id: "image"
      },
      layout: $layout.fill
    }]
  },
  layout: function(make, view) {
    make.bottom.left.right.inset(0)
    make.top.inset(52)
  },
  events: {
    didSelect: function(sender, indexPath, data) {
      imageDetails(data.image.src, indexPath, data.name, data.deleteURL, data.UploadDate, data.Height, data.Width)
    }
  }
}

const uploadImageBtn = {
  type: "button",
  props: {
    id: "Upload",
    title: "上传",
    bgcolor: $color("clear"),
    icon: $icon("166", $color("#5082E5"), $size(35, 35))
  },
  layout: function(make, view) {
    make.top.inset(10)
    make.right.inset(15)
    make.size.equalTo($size(42, 42))
  },
  events: {
    tapped: function(sender) {
      $ui.menu({
        items: ["拍摄照片", "相册选取", "最后一张", "手动添加"],
        handler: function(title, idx) {
          switch (idx) {
            case 0:
              $photo.take({
                handler: function(resp) {
                  uploadImage(resp.image.jpg(1.0))
                }
              })
              break
            case 1:
              $photo.pick({
                handler: function(resp) {
                  uploadImage(resp.image.jpg(1.0))
                }
              })
              break
            case 2:
              $photo.fetch({
                count: 3,
                handler: function(images) {
                  uploadImage(images[0].jpg(1.0))
                }
              })
              break
            case 3:
              addImage()
              break
            default:
              break
          }
        }
      })
    }
  }
}

const imagesPage = {
  name: "imagesPage",
  page: {
    props: {
      title: "图库"
    },
    views: [
      imageStocker,
      uploadImageBtn
    ]
  }
}

const settingBtn = {
  type: "button",
  props: {
    title: "Setting",
    bgcolor: $color("clear"),
    icon: $icon("002", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10);
    make.right.inset(15);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      $ui.push(settingPage.page);
      $thread.background({
        delay: 0,
        handler: function() {
          $("tabSpaceChecker").on = LocalConfig.tabSpace;
          $("tabSpaceNumLabel").text = LocalConfig.tabSpaceNum.toString();
          $("tabSpaceNumStepper").value = LocalConfig.tabSpaceNum;
          $("editorFontSizeLabel").text = LocalConfig.editorFontSize.toString();
          $("editorFontSizeStepper").value = LocalConfig.editorFontSize;
          $("autoSaverChecker").on = LocalConfig.autoSaver;
          $("interlacedSwitch").on = LocalConfig.interlaced;

        }
      })
    }
  }
}

const returnBtn = {
  type: "button",
  props: {
    id: "returnBtn",
    title: "返回",
    bgcolor: $color("clear"),
    src: returnBtnIcon
  },
  layout: function(make, view) {
    make.top.inset(10);
    make.left.inset(15);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      localDataFolder = findPrevFolder();
      getChapters();
      listView.data = chapters;
    }
  }
}

const moveFileSelectionBtn = {
  type: "button",
  props: {
    id: "moveFileSelectionBtn",
    title: "移到这里"
  },
  layout: function(make, view) {
    make.top.inset(6);
    make.centerX.equalTo(view.super);
    make.size.equalTo($size(90, 32));
  },
  events: {
    tapped: function(sender) {
      moveFile();
    }
  }
}

const mask = {
  type: "view",
  props: {
    id: "mask",
    hidden: true,
    bgcolor: $color("#000000"),
    alpha: 0.4
  },
  layout: $layout.fill,
  events: {
    tapped: function() {
      triggerCreateBtn()
    }
  }
}

const createBtn = {
  type: "button",
  props: {
    bgcolor: $color("clear"),
    icon: $icon("104", $color("#777777"), $size(40, 40))
  },
  layout: function(make, view) {
    make.bottom.right.inset(20)
    make.size.equalTo($size(40, 40))

  },
  events: {
    tapped: function(sender) {
      triggerCreateBtn()
    }
  }
}

function triggerCreateBtn(close) {
  if ($("addNewChapterBtn").hidden) {

    $("mask").hidden = false;
    $("makeNewFolderBtn").hidden = false;
    $("addNewChapterBtn").hidden = false;

    $("mask").animator.makeOpacity(0.4).easeOutSine.animate(0.4)
    $("makeNewFolderBtn").animator.moveY(-80).easeOutBack.animate(0.4)
    $("addNewChapterBtn").animator.moveX(-80).easeOutBack.animate(0.4)

  } else {

    $delay(0.1, function() {
      $("mask").hidden = true;
      $("makeNewFolderBtn").hidden = true;
      $("addNewChapterBtn").hidden = true;
    })

    $("mask").animator.makeOpacity(0).easeOutSine.animate(0.4)
    $("makeNewFolderBtn").animator.moveY(80).easeOutBack.animate(0.4)
    $("addNewChapterBtn").animator.moveX(80).easeOutBack.animate(0.4)

  }
}

const addNewChapterBtn = {
  type: "button",
  props: {
    title: "新增章节",
    id: "addNewChapterBtn",
    hidden: true,
    bgcolor: $color("clear"),
    icon: $icon("031", $color("#333333"), $size(40, 40))
  },
  layout: function(make, view) {
    make.bottom.right.inset(20)
    make.size.equalTo($size(40, 40))
  },
  events: {
    tapped: function(sender) {
      triggerCreateBtn();
      $input.text({
        type: $kbType.default,
        placeholder: "请输入章节文件名(无需扩展名)",
        handler: function(chapterFileName) {
          chapterFileName = chapterFileName.split("\n")[0].replace(/(^\s*)|(\s*$)/g, "");
          if (!$file.exists(localDataFolder + chapterFileName + ".txt")) {
            var space = " ";
            for (var i = 0; i < parseInt(LocalConfig.tabSpaceNum) - 1; i++) {
              space = space + " ";
            }
            var newFileSuccess = $file.write({
              data: $data({ string: space }),
              path: localDataFolder + chapterFileName + ".txt"
            })
            if (newFileSuccess) {
              $ui.toast(chapterFileName + ".txt 创建成功");
              getChapters();
              listView.data = chapters;
              var index = chapters.indexOf(chapterFileName + ".txt");
              editChapter($indexPath(index, index));
            } else {
              $ui.toast("文件创建失败");
            }
          } else {
            $ui.toast("文件已存在，请勿重复创建");
          }
        }
      })
    }
  }
}

const convertionBtn = {
  type: "button",
  props: {
    title: "转换",
    bgcolor: $color("clear"),
    src: transIcon,
    alpha: 0.6
    //icon: $icon("162", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10)
    make.left.equalTo(view.prev.right).offset(10);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      $ui.toast("正在处理，请稍等");
      markdown2html($("editor").text)
    }
  }
}

const imageBtn = {
  type: "button",
  props: {
    title: "图库",
    bgcolor: $color("clear"),
    icon: $icon("014", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10)
    make.left.equalTo(view.prev.right).offset(10);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      $ui.push(imagesPage.page)
      imageLoad()
    }
  }
}

const splitTextBtn = {
  type: "button",
  props: {
    title: "分词",
    bgcolor: $color("clear"),
    icon: $icon("153", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10)
    make.left.equalTo(view.prev.right).offset(10);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      textSplitorProcessor($("editor").text.substr($("editor").selectedRange.location, $("editor").selectedRange.length))
    }
  }
}

const splitTextCompleteBtn = {
  type: "button",
  props: {
    title: "分词",
    bgcolor: $color("clear"),
    icon: $icon("064", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.left.inset(10)
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      var slc = $("editor").selectedRange;
      $("editor").text = $("editor").text.slice(0, slc.location) + $("textSplitShow").text +
        $("editor").text.slice(slc.location + slc.length);
      $("editor").selectedRange = $range(slc.location, $("textSplitShow").text.length)
      $ui.pop()
    }
  }
}

const copyToClipBoardBtn = {
  type: "button",
  props: {
    title: "复制到剪贴板",
    bgcolor: $color("clear"),
    icon: $icon("019", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10)
    make.left.equalTo(view.prev.right).offset(10);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      $clipboard.text = $("textSplitShow").text;
      $ui.toast("已复制到剪贴板")
    }
  }
}

const makeNewFolderBtn = {
  type: "button",
  props: {
    id: "makeNewFolderBtn",
    title: "新建文件夹",
    hidden: true,
    bgcolor: $color("clear"),
    icon: $icon("057", $color("#333333"), $size(40, 40))
  },
  layout: function(make, view) {
    make.right.bottom.inset(20)
    make.size.equalTo($size(40, 40))
  },
  events: {
    tapped: function(sender) {
      triggerCreateBtn();
      $input.text({
        type: $kbType.default,
        placeholder: "请输入新笔记本名",
        handler: function(notebookName) {
          notebookName = notebookName.replace(/(^\s*)|(\s*$)/g, "");
          if (!$file.isDirectory(localDataFolder + notebookName)) {
            var mkdirSuccess = $file.mkdir(localDataFolder + notebookName)
            if (mkdirSuccess) {
              $ui.toast("笔记本 " + notebookName + " 创建成功")
              getChapters();
              listView.data = chapters;
            } else {
              $ui.toast("笔记本 " + notebookName + " 创建失败")
            };
          } else {
            $ui.toast("笔记本已存在");
          }
        }
      })
    }
  }
}

const fileListBlurBg = {
  type: "view",
  views: [{
    type: "view",
    props: {
      bgcolor: $color("#000000")
    },
    layout: function(make, view) {
      make.left.right.bottom.inset(20)
      make.top.inset(70)
    }
  }, {
    type: "blur",
    props: {
      style: 1, // 0 ~ 5
      //bgcolor: $color("#000000"),
      alpha: 1
    },
    layout: $layout.fill
  }],
  layout: $layout.fill
}

const fileListView = {
  type: "list",
  props: {
    id: "fileList",
    template: listTemplate,
    reorder: true,
    //bgcolor: DARKBG,
    borderWidth: 1,
    borderColor: $color("#EEEEEE"),
    separatorHidden: true,
    radius: 5,
    data: [{
      title: "1",
      rows: ["1"]
    }],
    footer: {
      type: "label",
      props: {
        height: 20,
        text: "Enjoy pure writing.",
        textColor: $color("#AAAAAA"),
        align: $align.center,
        font: $font(12)
      }
    },
    actions: [{
        title: "移动",
        handler: function(sender, indexPath) {
          renderFolderList(indexPath)
        }
      },
      {
        title: "重命名",
        handler: function(sender, indexPath) {
          renameFile(indexPath)
        }
      },
      {
        title: "删除",
        handler: function(sender, indexPath) {
          var isFolder = $file.isDirectory(localDataFolder + chapters[indexPath.row].textTitle.text) ? "笔记本包含里面的所有文章，请注意备份" : "文章: " + chapters[indexPath.row].textTitle.text;
          $ui.alert({
            title: "确认删除?",
            message: isFolder,
            actions: [{
                title: "确认",
                handler: function() {
                  deleteFile(indexPath);
                }
              },
              {
                title: "取消",
                handler: function() {

                }
              }
            ]
          })
          listView.data = chapters;
        }
      },
      {
        title: "导出",
        handler: function(sender, indexPath) {
          if ($file.isDirectory(localDataFolder + chapters[indexPath.row].textTitle.text)) {
            zipFiles(localDataFolder + chapters[indexPath.row].textTitle.text)
          } else {
            var fileItem = $file.read(localDataFolder + chapters[indexPath.row].textTitle.text)
            // $ui.loading("处理中…");
            $share.sheet([chapters[indexPath.row].textTitle.text, fileItem])
          }
          // $ui.loading(false);
        }
      }
    ]
  },
  layout: function(make, view) {
    make.left.right.bottom.inset(5);
    make.top.inset(44)
  },
  events: {
    didSelect: function(sender, indexPath, lestdata) {
      var data = lestdata.textTitle.text
      //$console.info(data)

      if ($file.isDirectory(localDataFolder + data)) {
        localDataFolder = localDataFolder + data + "/";
        getChapters();
        prevFolder = findPrevFolder();
        refreshList(chapters, listView);
      } else {
        // File selected
        editChapter(indexPath)
        try {
          var oldLinesNum = sender.text.match(/\n/gm).length;
        } catch (e) {
          var oldLinesNum = 0
        }
      }

    },
    reorderMoved: function(fromIndexPath, toIndexPath) {
      //$console.log(fromIndexPath.row)
      //$console.log(toIndexPath.row)
    },
    reorderFinished: function(data) {
      var formatedData = data.map(item => {
        return item.textTitle.text;
      })
      savedOrder = $cache.get("fileListOrder");
      savedOrder[localDataFolder + ""] = formatedData;
      $cache.setAsync({
        key: "fileListOrder",
        value: savedOrder
      });
      //$cache.set("fileListOrder", savedOrder)
      //$console.log(savedOrder)
    }
  }
}

const mainView = {
  type: "view",
  props: {
    id: "mainView",
  },
  views: [
    fileListBlurBg,
    settingBtn,
    returnBtn,
    fileListView,
    mask,
    addNewChapterBtn,
    makeNewFolderBtn,
    createBtn,
  ]
}

function getChapters() {
  var temp = $file.list(localDataFolder);
  //$cache.clear();
  var savedOrder = $cache.get("fileListOrder") ? $cache.get("fileListOrder") : {};
  //$console.info(savedOrder)
  if (typeof(savedOrder[localDataFolder + ""]) != "undefined") {
    temp.map(item => {
      savedOrder[localDataFolder + ""].indexOf(item) == -1 ? savedOrder[localDataFolder + ""].push(item) : false;
    })
    savedOrder[localDataFolder + ""].map((item, key) => {
      temp.indexOf(item) == -1 ? savedOrder[localDataFolder + ""].splice(key, 1) : false;
    })
  } else {
    savedOrder[localDataFolder + ""] = temp
  }
  $cache.setAsync({
    key: "fileListOrder",
    value: savedOrder
  })
  //$cache.set("fileListOrder", savedOrder)
  //$console.info(temp)
  //$console.info(savedOrder[localDataFolder+""])
  temp = savedOrder[localDataFolder + ""]
  //$console.info(temp)
  if (folderMode) {
    chapters = [];
    for (item of temp) {
      if ($file.isDirectory(localDataFolder + item)) {
        chapters.push({
          listIcon: {
            icon: $icon("057", $color("#AAAAAA"), $size(20, 20))
          },
          textTitle: {
            text: item
          }
        })
      }
    }
  } else {
    chapters = temp.map(item => {
      return $file.isDirectory(localDataFolder + item) ? {
        listIcon: {
          icon: $icon("057", $color("#AAAAAA"), $size(20, 20))
        },
        textTitle: {
          text: item
        }
      } : {
        listIcon: {
          icon: $icon("031", $color("#AAAAAA"), $size(20, 20))
        },
        textTitle: {
          text: item
        }
      }
    })
  }
}

function refreshList(data, view) {
  if (data.length == 0) {
    view.data = [""];
    view.delete(0)
  } else {
    view.data = data;
  }
}

function findPrevFolder() {
  curPathArr = localDataFolder.split('/');
  curPathArr.splice(curPathArr.length - 2, 2);
  curPathArr.push("");
  if (curPathArr.length < 4) {
    $ui.toast("已到根目录");
    prevFolder = localDataFolder;
  } else {
    prevFolder = curPathArr.join("/")
  }
  return prevFolder;
}

function renderFolderList(indexPath) {
  var fileName = chapters[indexPath.row].textTitle.text;
  curPath = localDataFolder + fileName;
  $("mainView").add(moveFileSelectionBtn);
  folderMode = true;
  getChapters();
  refreshList(chapters, listView);
}

function moveFile() {
  var fileName = curPath.split("/")[curPath.split("/").length - 1]
  var dstPath = localDataFolder + fileName;
  if (!$file.exists(dstPath) && !$file.isDirectory(dstPath)) {
    var moveSuccess = $file.move({
      src: curPath,
      dst: dstPath
    })
    if (moveSuccess) {
      $ui.toast("已移动到" + localDataFolder.split("/")[localDataFolder.split("/").length - 2]);
    } else {
      $ui.alert("移动失败");
    }
  } else {
    $ui.alert("目标文件(夹)已存在")
  }
  folderMode = false;
  getChapters();
  refreshList(chapters, listView);
  $("moveFileSelectionBtn").remove()
}

function checkFirstUse() {
  if ($cache.get("usedBefore")) {
    $cache.set("usedBefore", true)
  }
}

function renameFile(indexPath) {
  var oldName = chapters[indexPath.row].textTitle.text;
  $input.text({
    type: $kbType.default,
    placeholder: oldName,
    handler: function(newName) {
      newName = newName.replace(/(^\s*)|(\s*$)/g, "");
      if ($file.isDirectory(localDataFolder + oldName)) {
        if (oldName == newName) {
          $ui.alert("不能与原名相同")
          return false;
        }
        if (!$file.isDirectory(localDataFolder + newName)) {
          var renameSuccess = $file.move({
            src: localDataFolder + oldName,
            dst: localDataFolder + newName
          })
          if (renameSuccess) {
            getChapters();
            listView.data = chapters;
          } else {
            $ui.alert("重命名失败")
          }
        } else {
          $ui.alert(newName + " 已存在");
        }
      } else {
        if (oldName == (newName + ".txt")) {
          $ui.alert("不能与原名相同")
          return false;
        }
        if (!$file.exists(localDataFolder + newName + ".txt")) {

          var renameSuccess = $file.move({
            src: localDataFolder + oldName,
            dst: localDataFolder + newName + ".txt"
          })
          if (renameSuccess) {
            getChapters();
            listView.data = chapters;
          } else {
            $ui.alert("重命名失败")
          }
        } else {
          $ui.alert(newName + ".txt" + " 不能与原名 " + oldName + " 相同");
        }
      }
    }
  })
}

function listInboxFiles() {
  let inboxFilesTemp = $file.list("inbox://");
  let importZipFilePath = "shared://gditor/导入的文章"
  let inboxFiles = inboxFilesTemp.map(item => {
    let fileExt = item.split(".").pop()
    return {
      listIcon: {
        icon: $icon(fileExt == "zip" ? "155" : "031", $color("#AAAAAA"), $size(20, 20))
      },
      textTitle: {
        text: item
      }
    }
  })
  $ui.push({
    views: [{
      type: "list",
      props: {
        id: "inboxList",
        data: inboxFiles,
        template: listTemplate
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath) {
          let fileName = inboxFiles[indexPath.row].textTitle.text
          let path = "inbox://" + fileName;
          let fileExt = fileName.split(".").pop()

          function deleteFile() {
            $file.delete(path)
            sender.delete(indexPath)
          }
          $ui.menu({
            items: ["导入后删除", "直接删除"],
            handler: function(title, index) {
              switch (index) {
                case 0:
                  let fileData = $file.read(path);
                  if (fileExt == "txt") {
                    //$console.info("txt文件");
                    if ($file.exists(importZipFilePath + fileName)) {
                      $ui.alert({
                        title: "导入失败",
                        message: "文章已存在",
                      })
                      return false;
                    }
                    var importFileSuccess = $file.write({
                      data: $data({
                        string: fileData.string
                      }),
                      path: importZipFilePath + fileName
                    });
                    if (importFileSuccess) {
                      $ui.toast(`导入 ${fileName} 成功`)
                      deleteFile();
                      getChapters();
                      refreshList(chapters, listView);
                    } else {
                      $ui.alert(`导入 ${fileName} 失败`)
                    }
                  } else if (fileExt == "zip") {
                    $ui.alert({
                      title: "⚠️请注意⚠️",
                      message: "解压后会自动覆盖命名重复的文件，请确认：",
                      actions: [{
                          title: "确认",
                          handler: function() {
                            $ui.loading(true);
                            $ui.toast(`正在解压 ${fileName}`);
                            !$file.isDirectory(localDataFolder) ? $file.mkdir(localDataFolder) : false;
                            $archiver.unzip({
                              file: fileData,
                              dest: importZipFilePath,
                              handler: function(success) {
                                $ui.loading(false);
                                if (success) {
                                  $ui.toast(`解压 ${fileName} 成功`)
                                  deleteFile();
                                  getChapters();
                                  refreshList(chapters, listView);
                                } else {
                                  $ui.alert(`解压 ${fileName} 失败`)
                                }
                              }
                            })
                          }
                        },
                        {
                          title: "取消",
                          handler: function() {
                            $ui.toast("已取消导入")
                          }
                        }
                      ]
                    })
                  } else {
                    $ui.toast("暂不支持此格式文件导入")
                  }
                  break;
                case 1:
                  deleteFile();
                  break;
              }
            }
          })
        }
      }
    }]
  })
}

function imageLoad() {
  var items = []
  var files = $file.list(localImageFolder)
  for (var i = 0; i < files.length; i++) {
    var name = files[i].replace(".txt", "")
    var data = $file.read(localImageFolder + files[i]).string.split(",")
    items.push({
      image: {
        src: data[0]
      },
      name: files[i].replace(".txt", ""),
      deleteURL: data[1],
      UploadDate: data[2],
      Height: data[3],
      Width: data[4]
    })
  }
  $("imageStocker").data = items
  $("imageStocker").data = $("imageStocker").data.reverse()
}

function imageDetails(url, indexpath, name, deleteURL, UploadDate, Height, Width) {
  $ui.push({
    views: [{
        type: "image",
        props: {
          id: "Image",
          src: url
        },
        layout: function(make, view) {
          make.top.left.right.inset(0)
          make.height.equalTo(250)
        }
      },
      {
        type: "list",
        props: {
          id: "imageDetailList",
          data: [{
              title: "url",
              rows: [url]
            }, {
              title: "html",
              rows: ["<img src=\"" + url + " \"alt=\"" + name + "\" title=\"" + name + "\">"]
            }, {
              title: "bbcode",
              rows: ["[img]" + url + "[/img]"]
            }, {
              title: "markdown",
              rows: ["![" + name + "](" + url + ")"]
            },
            {
              title: "操作图片",
              rows: ["分享图片", "详细信息", "删除图片"]
            }
          ]
        },
        layout: function(make, view) {
          make.top.equalTo($("Image").bottom)
          make.left.right.inset(0)
          make.bottom.inset(52)
        },
        events: {
          didSelect: function(sender, indexPath, title) {
            if (indexPath.section == 4) {
              if (indexPath.row == 0) {
                $ui.loading(true)
                $http.download({
                  url: url,
                  handler: function(resp) {
                    $ui.loading(false)
                    $share.universal(resp.data)
                  }
                })
              } else if (indexPath.row == 1) {
                $ui.alert({
                  title: name,
                  message: "上传日期:" + UploadDate + "\n宽:" + Height + "\n高:" + Width
                })
              } else if (indexPath.row == 2) {
                var ListItems = (deleteURL == "") ? ["删除本地图片"] : ["仅删除本地图片", "删除本地和云端"]
                $ui.menu({
                  items: ListItems,
                  handler: function(title, idx) {
                    if (idx == 0) {
                      $("imageStocker").delete(indexpath)
                      $file.delete(localImageFolder + name + ".txt")
                      $ui.toast("已在本地删除此图片")
                      $ui.pop()
                    } else {
                      $ui.loading(true)
                      $http.get({
                        url: deleteURL,
                        handler: function(resp) {
                          $ui.loading(false)
                          $("imageStocker").delete(indexpath)
                          $file.delete(localImageFolder + name + ".txt")
                          $ui.toast("已在云端和本地删除此图片")
                          $ui.pop()
                        }
                      })
                    }
                  }
                })
              }
            } else {
              //$clipboard.text = title
              //$ui.toast("已复制:" + title)
              var slc = $("editor").selectedRange;
              $("editor").text = $("editor").text.slice(0, slc.location) + title +
                $("editor").text.slice(slc.location + slc.length);
              $("editor").selectedRange = $range(slc.location, title.length)
              $ui.pop()
              $ui.pop()
            }
          }
        }
      }
    ]
  })
}

function uploadImage(pic) {
  if (typeof(pic) == "undefined") {} else {
    $ui.loading(true)
    $http.upload({
      url: "https://sm.ms/api/upload",
      files: [{ "data": pic, "name": "smfile" }],
      handler: function(resp) {
        $ui.loading(false)
        var data = resp.data.data
        var date = data.path.match(/\d+\/\d+\/\d+/)
        $file.write({
          data: $data({ string: data.url + "," + data.delete + "," + date + "," + data.height + "," + data.width }),
          path: localImageFolder + data.filename + ".txt"
        })
        imageLoad()
      }
    })
  }
}

function addImage() {
  $ui.push({
    props: {
      title: "添加图片"
    },
    views: [{
        type: "input",
        props: {
          id: "imageNameInput",
          align: $align.left,
          placeholder: "输入图片名称",
        },
        layout: function(make, view) {
          make.top.left.right.inset(10)
          make.size.equalTo($size(100, 40))
        },
      },
      {
        type: "input",
        props: {
          id: "imageLinkInput",
          align: $align.left,
          placeholder: "输入图片链接",
        },
        layout: function(make, view) {
          make.left.right.inset(10)
          make.top.equalTo($("imageNameInput").bottom).offset(10)
          make.size.equalTo($size(100, 40))
        },
      },
      {
        type: "button",
        props: {
          title: "添加"
        },
        layout: function(make, view) {
          make.left.right.inset(10)
          make.top.equalTo($("imageLinkInput").bottom).offset(10)
        },
        events: {
          tapped: function(sender) {
            if ($("imageNameInput").text == "") {
              $ui.toast("图片名称不能为空")
            } else if ($("imageLinkInput").text == "") {
              $ui.toast("图片链接不能为空")
            } else if ($("imageLinkInput").text.indexOf("http") == -1) {
              $ui.toast("请填写正确的图片链接")
            } else {
              $file.write({
                data: $data({ string: $("imageLinkInput").text + "," }),
                path: localImageFolder + $("imageNameInput").text + ".txt"
              })
              $ui.toast("已添加图片\"" + $("imageNameInput").text + "\"")
              imageLoad()
              $ui.pop()
            }
          }
        }
      }
    ]
  })
}

function textSplitorProcessor(splitText) {
  if (splitText == "") {
    $ui.toast("不能为空区域分词")
  }
  $text.tokenize({
    text: splitText,
    handler: function(results) {
      var matrixUI = {
        name: "Text Splitor",
        page: {
          views: [{
              type: "text",
              props: {
                id: "textSplitShow",
                align: $align.justified,
                font: $font("bold", 20)
              },
              layout: function(make) {
                make.left.right.inset(15)
                make.top.inset(32)
                make.height.equalTo(120)
              }
            },
            {
              type: "matrix",
              props: {
                columns: 6,
                itemHeight: 50,
                spacing: 5,
                template: [{
                  type: "label",
                  props: {
                    id: "tile",
                    bgcolor: $color("#AAAAAA"),
                    textColor: $color("#FFFFFF"),
                    align: $align.center,
                    font: $font(22),
                    radius: 5
                  },
                  layout: $layout.fill
                }],
                data: results.map(function(item) {
                  return {
                    tile: {
                      text: "" + item
                    }
                  }
                })
              },
              layout: function(make, view) {
                make.left.bottom.right.equalTo(0)
                make.top.equalTo(view.prev.bottom).offset(10)
              },
              events: {
                didSelect: function(sender, indexPath, data) {
                  var token = data.tile.text
                  var label = $("textSplitShow")
                  label.text = label.text + token
                }
              }
            },
            splitTextCompleteBtn,
            copyToClipBoardBtn
          ]
        }
      }
      $ui.push(matrixUI.page);
    }
  })
}

function saveConfig() {
  var success = $file.write({
    data: $data({ string: JSON.stringify(LocalConfig) }),
    path: configFilePath
  })
}

function getFileContent(fileName) {
  var exists = $file.exists(localDataFolder + fileName)
  if (exists) {
    var content = $file.read(localDataFolder + fileName).string;
  } else {
    var content = "";
  }
  return content;
}

function renderMainPage() {
  $ui.render(mainView)
}

function findChar(str, cha, num) {
  var x = str.indexOf(cha);
  for (var i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1);
  }
  return x;
}

function closestLine(elem) {
  for (var i = elem.selectedRange.location - 1; i >= 0; i--) {
    if (elem.text.substr(i, 1) == "\n") {
      return i;
    }
  }
  return -1;
}

function newLineProcess(sender) {
  try {
    var newLinesNum = sender.text.match(/\n/gm).length;
  } catch (e) {
    var newLinesNum = 0
  }
  if (newLinesNum > oldLinesNum) {
    var space = "" + (LocalConfig.interlaced ? "\n" : "")
    for (var i = 0; i < parseInt(LocalConfig.tabSpaceNum); i++) {
      space = space + " "
    }
    var cur = $("editor").selectedRange
    sender.text = sender.text.slice(0, cur.location) + space + sender.text.slice(cur.location)
    $("editor").selectedRange = $range(cur.location + parseInt(LocalConfig.tabSpaceNum) + (LocalConfig.interlaced ? 1 : 0), 0)
    oldLinesNum = newLinesNum;
    if (LocalConfig.interlaced) {
      oldLinesNum = oldLinesNum + 1
    }
  } else {
    oldLinesNum = newLinesNum;
  }
}

function MDahead(str) {
  //$("editor").editable= false;
  //$console.info($("editor").contentOffset)
  try {
    var totalLines = $("editor").text.match(/\n/gm).length;
  } catch (e) {
    var totalLines = 0
  }
  var pos = closestLine($("editor")) + 1;
  var space = " ";
  if ($("editor").text.substr(pos, 1) == str) {
    space = ""
  }
  $("editor").text = $("editor").text.slice(0, pos) + str + space + $("editor").text.slice(pos)
  $delay(0.1, function() {
    //$("editor").editable= true;
    //$("editor").focus()
    $("editor").selectedRange = $range(pos + 1, 0)
  })
 
}

function MDenclose(str) {
  var pos = $("editor").selectedRange
  $("editor").text = $("editor").text.slice(0, pos.location) +
    str +
    $("editor").text.slice(pos.location, pos.location + pos.length) +
    str +
    $("editor").text.slice(pos.location + pos.length);
  $delay(0.1, function() {
    $("editor").selectedRange = $range(pos.location, 0)
      $("editor").selectedRange = $range(pos.location + str.length, pos.length)
    })
  }

  const mdHashBtn = {
    type: "button",
    props: {
      id: "mdHashBtn",
      bgcolor: $color("clear"),
      alpha: 0.6,
      src: hashIcon
    },
    layout: function(make, view) {
      make.left.inset(10)
      make.top.equalTo(view.prev.bottom).offset(5);
      make.size.equalTo($size(24, 24))
    },
    events: {
      tapped: function(sender) {
        MDahead("#")
        $("mdHashBtn").alpha = 0.6
      }
    }
  }

  const mdBoldBtn = {
    type: "button",
    props: {
      id: "MDbold",
      bgcolor: $color("clear"),
      alpha: 0.6,
      src: boldIcon
    },
    layout: function(make, view) {
      make.top.equalTo(view.prev.top)
      make.left.equalTo(view.prev.right).offset(5);
      make.size.equalTo($size(24, 24))
    },
    events: {
      tapped: function(sender) {
        MDenclose("**")
        //sender.alpha = 0.6
      }
    }
  }

  const mdListBtn = {
    type: "button",
    props: {
      id: "MDlist",
      bgcolor: $color("clear"),
      alpha: 0.6,
      src: listIcon
    },
    layout: function(make, view) {
      make.top.equalTo(view.prev.top)
      make.left.equalTo(view.prev.right).offset(5);
      make.size.equalTo($size(24, 24))
    },
    events: {
      tapped: function(sender) {
        MDahead("*")
      }
    }
  }

  const mdCodeBtn = {
    type: "button",
    props: {
      id: "MDcode",
      bgcolor: $color("clear"),
      alpha: 0.6,
      src: codeIcon
    },
    layout: function(make, view) {
      make.top.equalTo(view.prev.top)
      make.left.equalTo(view.prev.right).offset(5);
      make.size.equalTo($size(24, 24))
    },
    events: {
      tapped: function(sender) {
        MDenclose("`")
      }
    }
  }

  const mdQuoteBtn = {
    type: "button",
    props: {
      id: "MDquote",
      bgcolor: $color("clear"),
      alpha: 0.6,
      src: quoteIcon
    },
    layout: function(make, view) {
      make.top.equalTo(view.prev.top)
      make.left.equalTo(view.prev.right).offset(5);
      make.size.equalTo($size(24, 24))
    },
    events: {
      tapped: function(sender) {
        MDahead(">")
      }
    }
  }

  const editorBlurBg = {
    type: "view",
    views: [{
      type: "view",
      props: {
        id: "editorShadowBlock",
        bgcolor: $color("#000000")
      },
      layout: function(make, view) {
        make.left.right.bottom.inset(20)
        make.top.inset(70)
      }
    }, {
      type: "blur",
      props: {
        style: 1, // 0 ~ 5
        //bgcolor: $color("#000000"),
        alpha: 1
      },
      layout: $layout.fill
    }],
    layout: $layout.fill
  }

  function editChapter(indexPath) {
    var timer;
    var fileName = chapters[indexPath.row].textTitle.text ? chapters[indexPath.row].textTitle.text : "";
    var editorView = {
      name: "editor",
      page: {
        props: {
          title: fileName,
        },
        views: [
          editorBlurBg,
          {
            type: "text",
            props: {
              id: "editor",
              borderWidth: 1,
              borderColor: $color("#EEEEEE"),
              radius: 5,
              font: $font(LocalConfig.editorFontSize),
              text: getFileContent(fileName)
            },
            layout: function(make, view) {
              make.left.right.inset(5);
              make.bottom.inset(30);
              make.top.inset(42);
            },
            events: {
              ready: function(sender) {
                sender.focus()
              },
              didBeginEditing: function(sender) {
                let offsetW = 0,
                    offsetH = 0;
                switch($device.info.model){
                  case "iPhone10,3":
                    offsetW = 0;
                    offsetH = 30;
                  break;
                  case "iPhone7,1":
                    offsetW = 0;
                    offsetH = 0;
                  break;
                  default:
                    offsetW = 0;
                    offsetH = 0;
                }
                if($device.info.model.indexOf("iPad")!=-1){
                  offsetW=205;
                  offsetH=45;
                };
                //console.log($device.info)
  if($device.info.screen.orientation>2){
                  var keyBoardHeight = 250 + offsetW;
                }else{
                  var keyBoardHeight = 335 + offsetH;
                }
                
                $("editorShadowBlock").updateLayout(function(make) {
                  make.bottom.inset(keyBoardHeight)
                })
                sender.updateLayout(function(make) {
                  make.bottom.inset(keyBoardHeight)
                })
                timer = $timer.schedule({
                  interval: 20,
                  handler: function() {
                    LocalConfig.autoSaver ? processSave(indexPath, fileName, true) : false
                  }
                })

              },
              didEndEditing: function(sender) {
                $("editorShadowBlock").updateLayout(function(make) {
                  make.bottom.inset(5)
                })
                sender.updateLayout(function(make) {
                  make.bottom.inset(5)
                })
                timer.invalidate()
                LocalConfig.autoSaver ? processSave(indexPath, fileName, true) : false;
              },
              didChange: function(sender) {
                if (LocalConfig.tabSpace) {
                  newLineProcess(sender)
                }
              },
              longPressed: function() {
                textSplitorProcessor($("editor").text.substr($("editor").selectedRange.location, $("editor").selectedRange.length))
              }
            }
          },
          mdHashBtn,
          mdBoldBtn,
          mdListBtn,
          mdCodeBtn,
          mdQuoteBtn,
          {
            type: "button",
            props: {
              title: "保存",
              bgcolor: $color("clear"),
              //icon: $icon("003", $color("#777777"), $size(20, 20)),
              alpha: 0.6,
              src: saveIcon
            },
            layout: function(make, view) {
              make.top.inset(10);
              make.left.inset(15);
              make.size.equalTo($size(24, 24));
            },
            events: {
              tapped: function(sender) {
                processSave(indexPath, fileName, false);
              }
            }
          },
          convertionBtn,
          splitTextBtn,
          imageBtn
        ]
      }
    }
    $ui.push(editorView.page);
    oldLinesNum = $("editor").text.match(/\n/gm).length;
  }

  function loopAllFiles(filePath) {
    var files = [];
    var list = $file.list(filePath);
    list.map((item, idx) => {
      if ($file.isDirectory(filePath + "/" + item)) {
        loopAllFiles(filePath + "/" + item)
      } else {
        files.push(filePath + "/" + item);
      }
    })
    return files;
  }

  function zipFiles(filePath) {
    $ui.toast("正在打包文件夹");
    var dest = "output.zip";
    var filePaths = loopAllFiles(filePath);
    var files = [];
    if (filePaths.length != 0) {
      $ui.loading(true);
      filePaths.map(item => {
        files.push($file.read(item))
      });
      $archiver.zip({
        files: files,
        dest: dest,
        handler: function(success) {
          $ui.loading(false);
          if (success) {
            $share.sheet([dest, $file.read(dest)])
          } else {
            $ui.toast("操作失败")
          }
        }
      })
    } else {
      $ui.toast("没有可打包导出的文件")
    }
  }

  function addChapter(chapterName) {
    chapters.unshift(chapterName);
    saveFile(chapterName, "")
  }

  function deleteFile(indexPath) {
    var fileName = chapters[indexPath.row].textTitle.text;
    var temp = chapters.map(item => {
      return item.textTitle.text
    })
    var index = temp.indexOf(fileName);
    if (index >= 0) {
      chapters.splice(index, 1);
      var deleteFile = $file.delete(localDataFolder + fileName)
      if (deleteFile) {
        getChapters();
        refreshList(chapters, listView);
        $ui.toast("已删除");
      }
    }
  }

  function processSave(indexPath, fileName, auto) {
    fileName = fileName.replace(/(\.txt)/g, "");
    saveFile(fileName, $("editor").text, auto);
    getChapters();
    //chapters = $file.list(localDataFolder);
    listView.data = chapters;
  }

  function saveFile(fileName, content, auto) {
    var saveFileSuccess = $file.write({
      data: $data({
        string: content
      }),
      path: localDataFolder + fileName + ".txt"
    })
    if (saveFileSuccess) {
      !auto ? $ui.toast("保存成功") : false;
    }
  }

  function markdown2html(text) {
    $ui.loading("处理中…");
    /*
  var $pageSize = {
  letter: 0, governmentLetter: 1, legal: 2, juniorLegal: 3, ledger: 4, tabloid: 5,
  A0: 6, A1: 7, A2: 8, A3: 9, A4: 10, A5: 11, A6: 12, A7: 13, A8: 14, A9: 15, A10: 16,
  B0: 17, B1: 18, B2: 19, B3: 20, B4: 21, B5: 22, B6: 23, B7: 24, B8: 25, B9: 26, B10: 27,
  C0: 28, C1: 29, C2: 30, C3: 31, C4: 32, C5: 33, C6: 34, C7: 35, C8: 36, C9: 37, C10: 38,
  custom: 52
}
  */
    $http.post({
      url: "https://api.github.com/markdown",
      body: { text: text, mode: "gfm", context: "github/gollum" },
      handler: function(resp) {
        $ui.loading(false)
        var html = resp.data
        $ui.menu({
          items: ["预览结果", "拷贝到剪贴板", "创建 PDF 文件"],
          handler: function(title, idx) {
            if (idx == 0) {
              //$("preView").html = html;
              $quicklook.open({ html: html })
            } else if (idx == 1) {
              $clipboard.html = html
            } else {
              $ui.menu({
                items: ['letter', 'governmentLetter', 'legal', 'juniorLegal', 'ledger', 'tabloid', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'custom'],
                handler: function(sizeTitle, idx) {
                  $pdf.make({
                    html: html,
                    pageSize: $pageSize[sizeTitle],
                    handler: function(resp) {
                      if (resp.data) {
                        $share.sheet(["Gidotor-output.pdf", resp.data])
                      }
                    }
                  })
                },
                finished: function(cancelled) {}
              })
            }
          }
        })
      }
    })
  }

  function checkUpdate() {
    $http.get({
      url: "https://raw.githubusercontent.com/gadzan/Gditor/master/version.json",
      handler: function(resp) {
        var newVersion = resp.data.version;
        var msg = resp.data.msg;
        if (newVersion > version) {
          $ui.alert({
            title: "最新版本为 " + newVersion,
            message: "更新后自动会关闭本扩展,重新打开本扩展即可.\n" + msg,
            actions: [{
              title: "更新",
              handler: function() {
                var url = "jsbox://install?url=https://raw.githubusercontent.com/gadzan/Gditor/master/Gditor.js&name=Gditor&icon=icon_030.png";
                $app.openURL(encodeURI(url));
                $app.close()
              }
            }, {
              title: "取消"
            }]
          })
        }
      }
    })
  }

  function detectImportFiles() {
    if ($context.dataItems) {
      $ui.alert("暂不支持运行本扩展导入文件，导入文件请直接选择 拷贝到“JSBox”，而后进入设置->导入进行导入操作。")
      //var importFiles = $context.dataItems;
      //importFiles[0].info.mimeType=="text/plain"
    }
  }

  checkUpdate();
  renderMainPage();
  checkFirstUse();
  detectImportFiles();
  var listView = $("fileList");
  getChapters()
  listView.data = chapters;