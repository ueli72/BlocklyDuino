// Chrome flyout click fix with Mutator support
// This file fixes Chrome flyout click issues while properly supporting mutator functionality

(function() {
  function addFlyoutClickFix() {
    if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace) {
      setTimeout(addFlyoutClickFix, 100);
      return;
    }

    if (window.flyoutClickFixApplied) return;
    window.flyoutClickFixApplied = true;

    // Track active mutator to avoid interfering with it
    var activeMutator = null;
    
    // Hook into mutator setVisible to track when mutators are open/closed
    if (Blockly.Mutator && Blockly.Mutator.prototype.setVisible) {
      var originalSetVisible = Blockly.Mutator.prototype.setVisible;
      Blockly.Mutator.prototype.setVisible = function(visible) {
        if (visible) {
          activeMutator = this;
        } else if (activeMutator === this) {
          activeMutator = null;
        }
        return originalSetVisible.call(this, visible);
      };
    }

    // Handle mousedown events for both main toolbox flyout and mutator flyout
    document.addEventListener('mousedown', function(e) {
      // Check if there's an active mutator with a flyout
      if (activeMutator && activeMutator.workspace_ && activeMutator.workspace_.flyout_) {
        var mutatorFlyout = activeMutator.workspace_.flyout_;
        var flyoutSvg = mutatorFlyout.svgGroup_;
        
        if (flyoutSvg) {
          var rect = flyoutSvg.getBoundingClientRect();
          var inMutatorFlyout = e.clientX >= rect.left && e.clientX <= rect.right &&
                               e.clientY >= rect.top && e.clientY <= rect.bottom;
          
          if (inMutatorFlyout) {
            // Find which block was clicked in the mutator flyout
            var flyoutBlocks = mutatorFlyout.workspace_.getTopBlocks(true);
            for (var i = 0; i < flyoutBlocks.length; i++) {
              var flyoutBlock = flyoutBlocks[i];
              var svgRoot = flyoutBlock.getSvgRoot();
              if (svgRoot) {
                var blockRect = svgRoot.getBoundingClientRect();
                var inBlock = e.clientX >= blockRect.left && e.clientX <= blockRect.right &&
                             e.clientY >= blockRect.top && e.clientY <= blockRect.bottom;
                
                if (inBlock) {
                  // Clone the flyout block to the mutator workspace and connect it
                  try {
                    var mutatorWorkspace = activeMutator.workspace_;
                    
                    // Find the container block
                    var containerBlock = null;
                    var allBlocks = mutatorWorkspace.getAllBlocks();
                    for (var j = 0; j < allBlocks.length; j++) {
                      var type = allBlocks[j].type;
                      if (type === 'controls_if_if' || type === 'controls_switch_switch' ||
                          type === 'lists_create_with_container' || type === 'text_create_join_container' ||
                          type === 'procedures_mutatorcontainer') {
                        containerBlock = allBlocks[j];
                        break;
                      }
                    }
                    
                    if (containerBlock) {
                      // Convert the flyout block to XML and create a new block in mutator workspace
                      var xml = Blockly.Xml.blockToDom_(flyoutBlock);
                      xml.removeAttribute('x');
                      xml.removeAttribute('y');
                      
                      var newBlock = Blockly.Xml.domToBlock(mutatorWorkspace, xml);
                      
                      // Find the connection point in the container's stack
                      var stackInput = containerBlock.getInput('STACK');
                      var targetConnection = null;
                      
                      if (stackInput && stackInput.connection) {
                        var existingBlock = stackInput.connection.targetBlock();
                        if (existingBlock) {
                          // Walk to the end of the chain
                          while (existingBlock.nextConnection && existingBlock.nextConnection.targetBlock()) {
                            existingBlock = existingBlock.nextConnection.targetBlock();
                          }
                          if (existingBlock.nextConnection && newBlock.previousConnection) {
                            targetConnection = existingBlock.nextConnection;
                          }
                        } else {
                          targetConnection = stackInput.connection;
                        }
                      }
                      
                      // Connect the new block and update
                      if (targetConnection && newBlock.previousConnection) {
                        targetConnection.connect(newBlock.previousConnection);
                        
                        if (activeMutator.workspaceChanged_) {
                          activeMutator.workspaceChanged_();
                        }
                        
                        if (activeMutator.rootBlock_) {
                          activeMutator.block_.compose(activeMutator.rootBlock_);
                        }
                      }
                    }
                  } catch (err) {
                    console.log('Chrome flyout fix error:', err);
                  }
                  
                  e.stopPropagation();
                  e.preventDefault();
                  return;
                }
              }
            }
          }
        }
      }

      // Handle main toolbox flyout (original Chrome fix)
      var ws = Blockly.getMainWorkspace();
      if (!ws) return;

      var toolbox = ws.toolbox_;
      if (!toolbox || !toolbox.flyout_) return;

      var flyout = toolbox.flyout_;
      var flyoutSvg = flyout.svgGroup_;
      if (!flyoutSvg) return;

      var rect = flyoutSvg.getBoundingClientRect();
      var inFlyout = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (inFlyout && flyout.isVisible() && rect.width > 0) {
        var blocks = flyout.workspace_.getTopBlocks(true);
        for (var i = 0; i < blocks.length; i++) {
          var block = blocks[i];
          var svgRoot = block.getSvgRoot();
          if (svgRoot) {
            var blockRect = svgRoot.getBoundingClientRect();
            var inBlock = e.clientX >= blockRect.left && e.clientX <= blockRect.right &&
                         e.clientY >= blockRect.top && e.clientY <= blockRect.bottom;
            if (inBlock) {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFlyoutClickFix);
  } else {
    addFlyoutClickFix();
  }
})();
