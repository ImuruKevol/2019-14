import createDebug from "debug";
import { uuid } from "uuidv4";
import { CELL_ACTION } from "../actions/CellAction";
import {
  common,
  focus,
  block,
  target,
  clipboard,
  toolbar,
} from "./CellReducerHandler";

const debug = createDebug("boost:reducer:cell");

const cellReducerHandler = {
  [CELL_ACTION.INIT]: (state, action) => {
    const { cellUuid, createMarkdownCell, tag } = action;
    const newCellUuid = cellUuid || uuid();

    common.initUuid(cellUuid, newCellUuid);
    common.initCell(cellUuid, state.cellManager, {
      cell: createMarkdownCell,
      text: "",
      tag,
    });

    debug("Init cell next state", state.cellManager);

    return {
      ...state,
      cellManager: state.cellManager,
    };
  },

  [CELL_ACTION.NEW]: (state, action) => {
    const { start, cursor, cellManager } = state;
    const { cellUuid, createMarkdownCell, tag } = action;

    common.newUuid(cellUuid);

    const result = common.newCell(cellUuid, cellManager, {
      createCellCallback: createMarkdownCell,
      cursor,
      tag,
      start,
    });

    const nextState = {
      ...state,
      ...result,
    };

    debug("New cell", nextState);

    return nextState;
  },

  [CELL_ACTION.INPUT]: (state, action) => {
    const { cellManager } = state;
    const { cellUuid, text } = action;
    const result = common.inputText(cellUuid, cellManager, { text });

    // debug("Cell Change text", index, text);

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.DELETE]: (state, action) => {
    const { cellManager } = state;
    const { cellUuid, text } = action;

    if (state.block.start !== null) {
      const result = block.blockDelete(cellManager, { block: state.block });

      debug("Cells delete for Block", result);

      return {
        ...state,
        ...result,
      };
    }

    const result = common.deleteCell(cellUuid, cellManager, { text });

    debug("Cell delete", result);

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.FOCUS.PREV]: (state) => {
    const { currentIndex } = state;
    const nextIndex = focus.prev(currentIndex);

    debug(`Cell focus prev ${currentIndex} to ${nextIndex}`);

    return {
      ...state,
      currentIndex: nextIndex,
    };
  },

  [CELL_ACTION.FOCUS.NEXT]: (state) => {
    const { currentIndex, cellManager } = state;
    const nextIndex = focus.next(currentIndex, cellManager.cells.length);

    debug(`Cell focus next ${currentIndex} to ${nextIndex}`);

    return {
      ...state,
      currentIndex: nextIndex,
    };
  },

  [CELL_ACTION.FOCUS.MOVE]: (state, { cellUuid }) => {
    const { cellManager } = state;

    const result = focus.move(cellUuid, cellManager);

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.FOCUS.ATTACH]: (state, action) => {
    return {
      ...state,
      inputRef: action.inputRef,
    };
  },

  [CELL_ACTION.TARGET.TRANSFORM]: (state, action) => {
    const { cellUuid, cell, text, tag, start } = action;
    target.transform(cellUuid, state.cellManager, { cell, text, tag });

    return {
      ...state,
      start,
    };
  },

  [CELL_ACTION.BLOCK.ALL]: (state) => {
    const { cells } = state.cellManager;
    const result = block.selectAllBlock(cells.length - 1);

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.BLOCK.UP]: (state, action) => {
    const result = block.blockRangeUp(action.cellUuid, state.block);

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.BLOCK.DOWN]: (state, action) => {
    const { cells } = state.cellManager;
    const result = block.blockRangeDown(
      action.cellUuid,
      state.block,
      cells.length
    );

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.BLOCK.RELEASE]: (state) => {
    const emptyBlock = {
      start: null,
      end: null,
    };
    return {
      ...state,
      block: emptyBlock,
    };
  },

  [CELL_ACTION.CURSOR.MOVE]: (state, action) => {
    const cursor = {
      start: action.selectionStart,
      end: action.selectionEnd,
    };

    return {
      ...state,
      cursor,
    };
  },

  [CELL_ACTION.CLIPBOARD.COPY]: (state) => {
    if (!state.block.start) {
      return state;
    }
    const result = clipboard.copy(state.cellManager, state.block);
    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.CLIPBOARD.PASTE]: (state, action) => {
    const { cellManager } = state;
    const { cellUuid } = action;

    const dataObj = {
      clipboard: state.clipboard,
    };
    const result = clipboard.paste(cellUuid, cellManager, dataObj);

    return {
      ...state,
      ...result,
    };
  },

  [CELL_ACTION.TOOLBAR.SAVE]: (state) => {
    const { cellManager } = state;

    toolbar.save(cellManager);

    return state;
  },

  [CELL_ACTION.TOOLBAR.LOAD]: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },

  [CELL_ACTION.TOOLBAR.LOAD_FINISH]: (state) => {
    return {
      ...state,
      isLoading: false,
    };
  },
};

const cellReducer = (state, action) => {
  const handler = cellReducerHandler[action.type];

  if (handler === undefined) {
    return state;
  }

  return handler(state, action);
};

export default cellReducer;
