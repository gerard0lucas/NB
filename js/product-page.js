(function () {
  document.querySelectorAll('[data-product-tabs]').forEach(function (root) {
    var tabs = root.querySelectorAll('[data-tab]');
    var panels = root.querySelectorAll('[data-panel]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-tab');
        tabs.forEach(function (t) {
          t.classList.remove('product-tab-active', 'border-brand', 'text-brand', 'bg-brand/5');
          t.classList.add('border-transparent', 'text-[#6a7282]');
        });
        tab.classList.add('product-tab-active', 'border-brand', 'text-brand', 'bg-brand/5');
        tab.classList.remove('border-transparent', 'text-[#6a7282]');
        panels.forEach(function (panel) {
          panel.classList.toggle('active', panel.getAttribute('data-panel') === id);
        });
      });
    });
  });
})();
