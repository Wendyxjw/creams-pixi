
export default class ActionManager {
    constructor() {
        this.data = null;
        this.currentData = null;

        this.actionIndex = -1;
        this.actionList = [];     
    }

    init(data) {
        this.data = data;
        this.currentData = data;
        this.actionIndex = -1;
        this.actionList = []; 
    }

    getCurrentData() {
        return this.currentData;
    }

    addAction(action) {
        let data = this.currentData;
        try {
            this.currentData = action.do(data);
        } catch (error) {
            console.log(error);
            return;
        }
        this.actionIndex++;
        this.actionList.splice(this.actionIndex); // delete the orig actions
        this.actionList.push(action);
    }

    unDo() {
        let index = this.actionIndex;
        let list = this.actionList;
        let data = this.currentData;
        if (index === -1) {
            return;
        }
        let action = list[index];
        this.currentData = action.unDo(data);
        this.actionIndex--;
    }

    reDo() {
        let index = this.actionIndex;
        let list = this.actionList;
        let data = this.currentData;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        this.currentData = action.do(data);
        this.actionIndex++;
    }

}
