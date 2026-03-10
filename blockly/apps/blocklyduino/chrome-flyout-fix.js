// Chrome flyout click fix
// This file works around a Chrome bug where clicks on the flyout don't work
// because the workspace captures them first

(function() {
  function addFlyoutClickFix() {
    // Wait for Blockly to be ready
    if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace) {
      setTimeout(addFlyoutClickFix, 100);
      return;
    }

    // Only add the fix once
    if (window.flyoutClickFixAdded) return;
    window.flyoutClickFixAdded = true;

    console.log('Adding flyout click fix for Chrome');

    // Add a global mousedown handler to route clicks to flyout in Chrome
    document.addEventListener('mousedown', function(e) {
      var ws = Blockly.getMainWorkspace();
      if (!ws) return;

      // Check if click is in flyout area
      var toolbox = ws.toolbox_;
      if (!toolbox || !toolbox.flyout_) return;

      var flyout = toolbox.flyout_;
      var flyoutSvg = flyout.svgGroup_;
      if (!flyoutSvg) return;

      var rect = flyoutSvg.getBoundingClientRect();
      var inFlyout = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (inFlyout && flyout.isVisible() && rect.width > 0) {
        // Find which block was clicked
        var blocks = flyout.workspace_.getTopBlocks(true);
        for (var i = 0; i < blocks.length; i++) {
          var block = blocks[i];
          var svgRoot = block.getSvgRoot();
          if (svgRoot) {
            var blockRect = svgRoot.getBoundingClientRect();
            var inBlock = e.clientX >= blockRect.left && e.clientX <= blockRect.right &&
                         e.clientY >= blockRect.top && e.clientY <= blockRect.bottom;
            if (inBlock) {
              // Create the block
              var createFunc = flyout.createBlockFunc_(block);
              createFunc(e);
              e.stopPropagation();
              return;
            }
          }
        }
      }
    }, true);
  }

  // Start the fix when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFlyoutClickFix);
  } else {
    addFlyoutClickFix();
  }
})();
