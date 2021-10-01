import {TYPES} from '@components/core/BottomModal';

const actionOpenModal = ({ customHeader, customContent, title }) => ({
  type: TYPES.ACTION_OPEN_MODAL,
  payload: { customHeader, customContent, title }
});

const actionCloseModal = () => ({
  type: TYPES.ACTION_CLOSE_MODAL,
});

export default ({
  actionOpenModal,
  actionCloseModal,
});
