// import Vue from "vue";
// import Component from "vue-class-component";

// import "./style.scss";

// export interface TreeItem {
//   id: string;
//   caption: string;
//   parent: string;
//   isChecked: boolean;
//   expand: boolean;
//   children: Array<TreeItem>;
// }

// export interface TreeItemNew {
//   oldIds: string; 
//   treeList: Array<TreeItem>;
// }


// @Component({
//   name: "tree",
//   template: require("./index.html"),
//   props: ["treeNode", "nodeIndex"]
// })
// export class TreeNode extends Vue {
//   treeNode: TreeItem = (<any>this).treeNode;
//   nodeIndex: string = (<any>this).nodeIndex;

//   isActive: boolean = false;
//   checkedMap: any = {};

//   updateTreeNode(providedIndex: string) {
//     return this.nodeIndex + "_" + providedIndex;
//   }

//   private toggleAll(item: TreeItem) {
//     this.treeNode.isChecked = !this.treeNode.isChecked;

//     if (this.treeNode.children.length > 0) {
//       this.treeNode.children.forEach(element => {
//         this.forwaredToggle(element);
//       });
//     }
//     this.reverseToggle();
//   }

//   private forwaredToggle(item: TreeItem) {
//     item.isChecked = this.treeNode.isChecked;
//     if (item.children.length > 0) {
//       item.children.forEach(element => {
//         this.forwaredToggle(element);
//       });
//     }
//   }

//   private lastClicked()
//   {
//     this.treeNode.isChecked = !this.treeNode.isChecked;
    
//     this.reverseToggle();
//   }

//   private reverseToggle() {
//     if (this.nodeIndex) {
//       if (this.nodeIndex.length > 0) {
//         var formulateString = "";
//         var splitString = this.nodeIndex.split("_");

//         for(var index = splitString.length; index >= 0; index --) {
//           for(var limit = 0; limit < index; limit ++) {
//             if(formulateString.length < 1) {
//               formulateString = splitString[limit];
//             } else {
//               formulateString += ("_" + splitString[limit]);
//             }
//           }
//           var item = (document.getElementById(formulateString)  as HTMLInputElement);

//           if (item != null) {
//             if(!item.checked) {
//               item.checked = !item.checked;
//             }
//           }

//           formulateString = "";
//         }
//       }
//     }
//   }
// }


import Vue from "vue";
import Component from "vue-class-component";

import "./style.scss";

export interface TreeItem {
  id: string;
  caption: string;
  parent: string;
  isChecked: boolean;
  expand: boolean;
  children: Array<TreeItem>;
}

export interface TreeItemNew {
  oldIds: string;
  treeList: Array<TreeItem>;
}

@Component({
  name: "tree",
  template: require("./index.html"),
  props: ["treeNode", "nodeIndex"]
})
export class TreeNode extends Vue {
  treeNode: TreeItem = (<any>this).treeNode;
  nodeIndex: string = (<any>this).nodeIndex;

  isActive: boolean = false;

  updateTreeNode(providedIndex: string) {
    return this.nodeIndex + "_" + providedIndex;
  }

  private toggleAll(item: TreeItem) {
    this.toggleChildren(item, item.isChecked);
    this.$emit('update-parent');
  }

  private toggleChildren(item: TreeItem, isChecked: boolean) {
    item.isChecked = isChecked;
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        this.toggleChildren(child, isChecked);
      });
    }
  }

  private checkParent() {
    this.reverseToggle();
    this.updateParentCheckState(); 
    this.$emit('update-parent');
  }

  private updateParentCheckState() {
    let currentNode: TreeItem = this.treeNode;
    while (currentNode.parent) {
      const parentElement = this.getParentNode(currentNode.parent);
      if (parentElement) {
        parentElement.isChecked = parentElement.children.every(child => child.isChecked);
        currentNode = parentElement;
      } else {
        break;
      }
    }
  }

  private getParentNode(parentId: string): TreeItem | null {
    const findNode = (node: TreeItem, id: string): TreeItem | null => {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          const result = findNode(child, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    return findNode(this.$root.$children[0]["treeNode"], parentId);
  }
  private reverseToggle() {
    if (this.nodeIndex) {
      if (this.nodeIndex.length > 0) {
        var formulateString = "";
        var splitString = this.nodeIndex.split("_");

        for (var index = splitString.length; index >= 0; index--) {
          for (var limit = 0; limit < index; limit++) {
            if (formulateString.length < 1) {
              formulateString = splitString[limit];
            } else {
              formulateString += ("_" + splitString[limit]);
            }
          }
          var item = (document.getElementById(formulateString) as HTMLInputElement);

          if (item != null) {
            if (!item.checked) {
              item.checked = !item.checked;
            }
          }

          formulateString = "";
        }
      }
    }
  }
  
}