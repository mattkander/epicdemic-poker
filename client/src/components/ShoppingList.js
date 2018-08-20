import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getPoints, deleteItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

import socketIOClient from 'socket.io-client'

class ShoppingList extends Component {
  componentDidMount() {
    this.props.getPoints();
  }

  onDeleteClick = id => {
    this.props.deleteItem(id);
  };

  render() {

    const socket = socketIOClient("http://localhost:5000");
    socket.on('connect', () => {console.log('I connected on client')});
    socket.on('updatePoints', () => {
      console.log('fetching items from shopping list');
      this.props.getItems();
    });

    const { items } = this.props.item;
    return (
      <Container>
        <ListGroup>
          <TransitionGroup className="shopping-list">
            {items.map(({ _id, name }) => (
              <CSSTransition key={_id} timeout={500} classNames="fade">
                <ListGroupItem>
                  <Button
                    className="remove-btn"
                    color="danger"
                    size="sm"
                    onClick={this.onDeleteClick.bind(this, _id)}
                  >
                    &times;
                  </Button>
                  {name}
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

ShoppingList.propTypes = {
  getPoints: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  item: state.item
});

export default connect(
  mapStateToProps,
  { getPoints, deleteItem }
)(ShoppingList);
