import {
    SelectSuperState,
    NomalSelectState,
    EditingSelectState,
    NomalNoneState,
    EditingNoneState,
    EditingEraserState,
} from './State';
import { EditEnum, SelectEnum } from '../common/Graph';

export default function StateFactory(
    eEnum: EditEnum, sEnum: SelectEnum, enableEraser: boolean, index: Array<number>
): SelectSuperState {
    const ee = EditEnum;
    const se = SelectEnum;
    switch (true) {
        case ((eEnum === ee.Editing) && enableEraser):
            return new EditingEraserState(index, sEnum);
        case ((eEnum === ee.Editing) && (sEnum === se.None)):
            return new EditingNoneState(index, sEnum);
        case ((eEnum === ee.Editing) && (sEnum === se.Shape)):
        case ((eEnum === ee.Editing) && (sEnum === se.Line)):
        case ((eEnum === ee.Editing) && (sEnum === se.Point)):
            return new EditingSelectState(index, sEnum);
        case ((eEnum === ee.Nomal) && enableEraser):
            return new NomalNoneState(index, sEnum);
        case ((eEnum === ee.Nomal) && (sEnum === se.Shape)):
            return new NomalSelectState(index, sEnum);
        case ((eEnum === ee.Nomal) && (sEnum === se.None)):
        default:
            return new NomalNoneState(index, sEnum);
    }
}
