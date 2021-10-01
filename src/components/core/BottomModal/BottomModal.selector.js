import {createSelector} from 'reselect';

const bottomModalSelector = createSelector(
  (state) => state.bottomModal,
  (bottomModal) => bottomModal,
);

export default ({
  bottomModalSelector
});
