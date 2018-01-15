/*
Gditor
作者: Gadzan

*/
const 
  version = 0.8,
  localDataFolder = "shared://gditor/",
  configFilePath = "drive://gditor.json";

const tabEveryLineSwitch = {
  type: "view",
  props: {

  },
  views: [{
      type: "label",
      props: {
        text: "段前空格"
      },
      layout: function(make, view) {
        make.left.inset(10);
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
        make.right.inset(10);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          LocalConfig.tabSpace = sender.on;
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
        make.left.inset(10);
        make.centerY.equalTo(view.super);
      }
    },
    {
      type: "input",
      props: {
        id: "tabSpaceNumInput",
        type: $kbType.number,
        align: $align.center,
      },
      layout: function(make, view) {
        make.right.inset(10);
        make.centerY.equalTo(view.super);
        make.size.equalTo($size(64, 32))
      },
      events: {
        returned: function(sender) {

        },
        didEndEditing: function(sender) {
          LocalConfig.tabSpaceNum = parseInt($("tabSpaceNumInput").text);
          if (LocalConfig.tabSpaceNum) {
            saveConfig();
          } else {
            $ui.toast("输入错误")
            $("tabSpaceNumInput").focus();
          }
        }
      }
    }
  ],
  layout: $layout.fill
}

const settingListView = {
  type: "list",
  props: {
    id: "settingList",
    data: [{
        title: "编辑器设置",
        rows: [tabEveryLineSwitch, tabEveryLineNum]
      },
      {
        title: "其他设置",
        rows: [""]
      }
    ]
  },
  layout: function(make, view) {
    make.size.equalTo(view.super)
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
      $("tabSpaceChecker").on = LocalConfig.tabSpace;
      $("tabSpaceNumInput").text = LocalConfig.tabSpaceNum
    }
  }
}

const addNewChapterBtn = {
  type: "button",
  props: {
    title: "新增章节",
    bgcolor: $color("clear"),
    icon: $icon("104", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10);
    make.left.inset(15);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      editChapter(null);
    }
  }
}

const convertionBtn = {
  type: "button",
  props: {
    title: "转换",
    bgcolor: $color("clear"),
    icon: $icon("162", $color("#777777"), $size(20, 20))
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
    //make.center.equalTo(view.super);
    make.top.left.inset(10)
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      var slc = $("editor").selectedRange;
      $("editor").text = $("editor").text.slice(0,slc.location) + $("textSplitShow").text +
      $("editor").text.slice(slc.location + slc.length);
      $console.info($("editor").text.length)
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


const fileListView = {
  type: "list",
  props: {
    id: "fileList",
    reorder: true,
    borderWidth: 1,
    borderColor: $color("#AAAAAA"),
    radius: 5,
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
        title: "编辑",
        handler: function(sender, indexPath) {
          editChapter(indexPath)
        }
      },
      {
        title: "删除",
        handler: function(sender, indexPath) {
          deleteFile(indexPath);
          listView.data = chapters;
        }
      },
      {
        title: "导出",
        handler: function(sender, indexPath) {
          var fileItem = $file.read(localDataFolder + chapters[indexPath.row])
          $ui.loading("处理中…");
          $share.sheet([chapters[indexPath.row], fileItem])
          $ui.loading(false);
        }
      }
    ]
  },
  layout: function(make, view) {
    make.left.right.bottom.inset(5);
    make.top.inset(44)
  },
  events: {
    didSelect: function(sender, indexPath, data) {
      editChapter(indexPath)
    }
  }
}

function textSplitorProcessor(splitText) {
  if(splitText==""){
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
              layout: function(make,view) {
                make.left.bottom.right.equalTo(0)
                make.top.equalTo(view.prev.bottom).offset(10)
              },
              events: {
                didSelect: function(sender, indexPath, data) {
                  var token = data.tile.text
                  var label = $("textSplitShow")
                  //var cell = sender.cell(indexPath);
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
  //$console.info(success)
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
  $ui.render({
    props: {
      title: "文章编辑器",
    },
    views: [
      settingBtn,
      addNewChapterBtn,
      fileListView
    ]
  })
}

function tabSpaceProcess(sender) {
  var newLinesNum = sender.text.match(/\n/gm).length;
  if (newLinesNum > oldLinesNum) {
    var space = "";
    for (var i = 0; i < parseInt(LocalConfig.tabSpaceNum); i++) {
      space = space + " "
    }
    var cur = $("editor").selectedRange
    sender.text = sender.text.slice(0, cur.location) + space + sender.text.slice(cur.location)
    $("editor").selectedRange = $range(cur.location + parseInt(LocalConfig.tabSpaceNum), 0)
  }
  oldLinesNum = newLinesNum;
}

function editChapter(indexPath) {
  if (indexPath == null) {
    var fileName = "gditor_newfile";
  } else {
    var fileName = chapters[indexPath.row] ? chapters[indexPath.row] : "";
  }
  $console.info(fileName)
  var editorView = {
    name: "editor",
    page: {
      props: {
        title: "文章编辑器",
      },
      views: [{
          type: "text",
          props: {
            id: "editor",
            borderWidth: 1,
            borderColor: $color("#AAAAAA"),
            radius: 5,
            text: getFileContent(fileName)
          },
          layout: function(make, view) {
            make.left.right.bottom.inset(5);
            make.top.inset(42)
          },
          events: {
            ready: function(sender) {
              sender.focus()
            },
            didBeginEditing: function(sender) {
            },
            didEndEditing: function(sender) {
            },
            didChange: function(sender) {
              if (LocalConfig.tabSpace) {
                tabSpaceProcess(sender)
              }
            },
            longPressed: function(){
              textSplitorProcessor($("editor").text.substr($("editor").selectedRange.location, $("editor").selectedRange.length))
            }
          }
        },
        {
          type: "button",
          props: {
            title: "保存",
            bgcolor: $color("clear"),
            icon: $icon("003", $color("#777777"), $size(20, 20))
          },
          layout: function(make, view) {
            make.top.inset(10);
            make.left.inset(15);
            make.size.equalTo($size(24, 24));
          },
          events: {
            tapped: function(sender) {
              var contentTitle = $("editor").text.split("\n")[0].replace(/(^\s*)|(\s*$)/g, "");
              if (indexPath == null && $file.exists(localDataFolder + contentTitle + ".txt")) {
                $ui.toast("文件已存在，请不要重复创建");
                return false;
              }
              if (contentTitle != "") {
                if ((contentTitle + ".txt") != fileName && fileName != "gditor_newfile") {
                  //Replace
                  saveFile(contentTitle, $("editor").text, fileName);
                } else {
                  //Rewrite 
                  saveFile(contentTitle, $("editor").text);
                }
                chapters = $file.list(localDataFolder);
                listView.data = chapters;
              } else {
                $ui.toast("首行标题不能为空");
              }
            }
          }
        },
        convertionBtn,
        splitTextBtn,
      ]
    }
  }

  $ui.push(editorView.page);
  oldLinesNum = $("editor").text.match(/\n/gm).length;
}

function addChapter(chapterName) {
  chapters.unshift(chapterName);
  saveFile(chapterName, "")
}
function deleteFile(indexPath) {
  var fileName = chapters[indexPath.row];
  var index = chapters.indexOf(fileName);
  if (index >= 0) {
    chapters.splice(index, 1);
    var deleteFile = $file.delete(localDataFolder + fileName)
    if (deleteFile) {
      $ui.toast("已删除");
    }
  }
}

function saveFile(fileName, content, oldFileName) {
  var saveFileSuccess = $file.write({
    data: $data({
      string: content
    }),
    path: localDataFolder + fileName + ".txt"
  })
  if (oldFileName && saveFileSuccess) {
    var deleteFile = $file.delete(localDataFolder + oldFileName);
    deleteFile ? true : $ui.alert("删除旧文件失败")
  }
  if (saveFileSuccess) {
    $ui.toast("保存成功");
  }
}

function markdown2html(text) {
  $ui.loading("处理中…");
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
            $quicklook.open({ html: html })
          } else if (idx == 1) {
            $clipboard.html = html
          } else {
            $pdf.make({
              html: html,
              handler: function(resp) {
                if (resp.data) {
                  $share.sheet(["sample.pdf", resp.data])
                }
              }
            })
          }
        }
      })
    }
  })
}

!$file.isDirectory(localDataFolder) ? $file.mkdir(localDataFolder) : false;
var config = $file.read(configFilePath);
if (config) {
  var LocalConfig = JSON.parse(config.string);
} else {
  var LocalConfig = {
    tabSpace: true,
    tabSpaceNum: 2
  };
  saveConfig()
};
var chapters = $file.list(localDataFolder);
var oldLinesNum = 0;
renderMainPage();
var listView = $("fileList");
listView.data = chapters;
