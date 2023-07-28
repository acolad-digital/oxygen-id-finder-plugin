(function () {
  class IdFinderViewRenderer extends sync.view.ViewRenderer {
    constructor(editor) {
      super();
      this.selectionListener_ = this.updateOnSelectionChanged.bind(this);
      this.open_ = false;
      this.renderTimer_ = 0;
      this.XmlDom = '';
    }

    editorChanged(editor) {
      this.actionsManager_ = editor.getActionsManager();

      editor.getContent((e, content) => {
        let parser = new DOMParser();
        this.XmlDom = parser.parseFromString(content, "text/xml");
        let html = '';

        var ids = this.XmlDom.querySelectorAll('*[id]'), i;
        for (i = 0; i < ids.length; ++i) {
          let idAttr = ids[i].getAttribute('id');
          let elementName = ids[i].tagName;
          html += `
          <li>
            <div class="id-info">       
              <div class="id-details">
                <div class="id-value" onclick="goToId('${idAttr}')">${idAttr}</div>
                <div>Element: ${elementName}</div>
              </div>
            </div>
          </li>`;
        }

        this.container_.innerHTML = `
        <div id="filterIdsWrapper"><input type="tel" id="filterIds" name="filterIds" placeholder="Filter ids"></div>
        <ul class="id-list">
          ${html}
        </ul>
        `;

        document.getElementById('filterIds').addEventListener('input', filterIds);

      });
    }

    install(element) {
      console.log('Install Id Finder side view');
      this.container_ = element;
    }
    opened() { }

    closed() { }

    updateOnSelectionChanged() { }

    update() { }

    getTitle() {
      return "Id finder";
    }

    getIcon() {
          return sync.util.computeHdpiIcon("../plugin-resources/com.acolad.oxygen.IdFinder/search-24.png");
    }

  }

  let myIdFinderViewRenderer = new IdFinderViewRenderer();
  workspace.getViewManager().addView("id-finder");
  workspace.getViewManager().installView("id-finder", myIdFinderViewRenderer, 'left');

})();


function goToId(id) {
  workspace.currentEditor.actionsManager.invokeOperation(
    "ro.sync.ecss.extensions.commons.operations.MoveCaretOperation",
    {
      xpathLocation: '//*[@id="' + id + '"]',
      selection: 'Element'
    });
};

function filterIds() {
  const filterValue = this.value.toLowerCase();
  let idItems = document.querySelectorAll('.id-info');
  idItems.forEach(function (item) {
    const description = item.querySelector('.id-details div[class=id-value]').innerText.toLowerCase();

    if (description.includes(filterValue)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};