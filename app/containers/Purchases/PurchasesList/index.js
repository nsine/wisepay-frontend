import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import PurchaseItem from 'components/Purchases/PurchaseItem';
import { getPurchasesRequest } from 'pages/DashboardPage/actions';
import {
  makeSelectPurchasesList,
  makeSelectCurrentPurchase,
  makeSelectPendingPurchase,
} from 'pages/DashboardPage/selectors';
import ListFilter from 'components/ListFilter';
import PlusButton from 'components/PlusButton';


class PurchasesList extends Component {
  constructor(props) {
    super(props);
    this.renderPurchasesList = this.renderPurchasesList.bind(this);
    this.getPurchasesList = this.getPurchasesList.bind(this);
  }

  componentWillMount() {
    this.props.getPurchasesRequest();
  }

  getPurchasesList() {
    const { pendingPurchase, purchasesList } = this.props;
    if (pendingPurchase) {
      return [{ ...pendingPurchase, isPending: true }, ...purchasesList];
    }

    return purchasesList;
  }

  renderPurchasesList(props) {
    return (
      <List>
        {props.items.map((purchase) => (
          <PurchaseItem
            {...purchase}
            key={purchase.id || -1}
            isActive={_.get(props.currentPurchase, 'id') === purchase.id || purchase.isPending}
          />
        ))}
      </List>
    );
  }

  render() {
    const { currentPurchase, onPlusClick } = this.props;

    return (
      <div className="fill-parent purchases-list">
        <ListFilter
          renderList={this.renderPurchasesList}
          items={this.getPurchasesList()}
          filterProp="name"
          itemsPropName="items"
          inputPlaceholder="Enter purchase name"
          listProps={{
            currentPurchase,
          }}
        />
        <div className="go-to-create-purchase-btn">
          <PlusButton onClick={onPlusClick} />
        </div>
      </div>
    );
  }
}

PurchasesList.propTypes = {
  purchasesList: PropTypes.array,
  getPurchasesRequest: PropTypes.func,
  onPlusClick: PropTypes.func,
  currentPurchase: PropTypes.object,
  pendingPurchase: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  purchasesList: makeSelectPurchasesList(),
  currentPurchase: makeSelectCurrentPurchase(),
  pendingPurchase: makeSelectPendingPurchase(),
});

const mapDispatchToProps = {
  getPurchasesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchasesList);
