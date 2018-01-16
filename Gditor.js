/*
gihub地址: https://github.com/gadzan/Gditor

- 文章为txt格式，默认保存到JSbox本地
- 支持在文章页转换markdown为html并导出pdf
- 支持导出txt格式文件
- 支持分词，可选中区域长按空白处分词
- 支持设置段前空格
- 支持自动保存

To do: 
- 文件夹

*/
const
  version = 0.9,
  localDataFolder = "shared://gditor/",
  localImageFolder = "shared://imageStocker/"
configFilePath = "drive://gditor.json";

!$file.isDirectory(localDataFolder) ? $file.mkdir(localDataFolder) : false;
!$file.isDirectory(localImageFolder) ? $file.mkdir(localImageFolder) : false;
var config = $file.read(configFilePath);
if (!$cache.get("firstUse")) {
  // 第一次使用
  $cache.set("firstUse", true)
} else {

};
var configTamplate = {
  tabSpace: true,
  tabSpaceNum: 2,
  autoSaver: true
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
var
  chapters = $file.list(localDataFolder),
  oldLinesNum = 0;

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
          $("tabEveryLineLabel").textColor = sender.on ? $color("#HHHHHH") : $color("#AAAAAA");
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
        make.left.inset(10);
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
        make.right.inset(10);
        make.centerY.equalTo(view.super);
      },
      events: {
        changed: function(sender) {
          LocalConfig.autoSaver = sender.on;
          $("autoSaverLabel").textColor = sender.on ? $color("#HHHHHH") : $color("#AAAAAA");
          saveConfig()
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
        rows: [
          tabEveryLineSwitch,
          tabEveryLineNum,
          autoSaverSwitch
        ]
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
    make.top.left.right.inset(0)
    make.bottom.inset(52)
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
    type: 1,
    title: "上传",
    font: $font("bold", 18)
  },
  layout: function(make, view) {
    make.bottom.inset(10)
    make.left.inset(25)
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
      $("tabSpaceChecker").on = LocalConfig.tabSpace;
      $("tabSpaceNumInput").text = LocalConfig.tabSpaceNum
      $("autoSaverChecker").on = LocalConfig.autoSaver
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

const imageBtn = {
  type: "button",
  props: {
    title: "图库",
    bgcolor: $color("clear"),
    icon: $icon("081", $color("#777777"), $size(20, 20))
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
    //make.center.equalTo(view.super);
    make.top.left.inset(10)
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      var slc = $("editor").selectedRange;
      $("editor").text = $("editor").text.slice(0, slc.location) + $("textSplitShow").text +
        $("editor").text.slice(slc.location + slc.length);
      //$console.info($("editor").text.length)
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
    title: "新建文件夹",
    bgcolor: $color("clear"),
    icon: $icon("028", $color("#777777"), $size(20, 20))
  },
  layout: function(make, view) {
    make.top.inset(10)
    make.left.equalTo(view.prev.right).offset(10);
    make.size.equalTo($size(24, 24))
  },
  events: {
    tapped: function(sender) {
      $ui.alert("")
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
  var timer;
  if (indexPath == null) {
    var fileName = "gditor_newfile";
  } else {
    var fileName = chapters[indexPath.row] ? chapters[indexPath.row] : "";
  }
  //$console.info(fileName)
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
              timer = $timer.schedule({
                interval: 20,
                handler: function() {
                  LocalConfig.autoSaver ? processSave(indexPath, fileName, true) : false
                }
              })

            },
            didEndEditing: function(sender) {
              timer.invalidate()
              LocalConfig.autoSaver ? processSave(indexPath, fileName, true) : false;
            },
            didChange: function(sender) {
              if (LocalConfig.tabSpace) {
                tabSpaceProcess(sender)
              }
            },
            longPressed: function() {
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

function processSave(indexPath, fileName ,auto) {
  var contentTitle = $("editor").text.split("\n")[0].replace(/(^\s*)|(\s*$)/g, "");
  if (indexPath == null && $file.exists(localDataFolder + contentTitle + ".txt")) {
    $ui.toast("文件已存在，请不要重复创建");
    return false;
  }
  if (contentTitle != "") {
    if ((contentTitle + ".txt") != fileName && fileName != "gditor_newfile") {
      //Replace
      saveFile(contentTitle, $("editor").text, fileName, auto);
    } else {
      //Rewrite 
      saveFile(contentTitle, $("editor").text, null, auto);
    }
    chapters = $file.list(localDataFolder);
    listView.data = chapters;
  } else {
    !auto? $ui.toast("首行标题不能为空") : false;
  }

}

function saveFile(fileName, content, oldFileName, auto) {
  var saveFileSuccess = $file.write({
    data: $data({
      string: content
    }),
    path: localDataFolder + fileName + ".txt"
  })
  if (oldFileName && saveFileSuccess) {
    var deleteFile = $file.delete(localDataFolder + oldFileName);
    deleteFile ? true : !LocalConfig.autoSaver ? $ui.alert("删除旧文件失败") : false
  }
  if (saveFileSuccess) {
    !LocalConfig.autoSaver ? $ui.toast("保存成功") : false;
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

checkUpdate();
renderMainPage();
var listView = $("fileList");
listView.data = chapters;