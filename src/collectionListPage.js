import { useEffect, useState } from "react";
import { Button, Row, Col, Modal, Form } from "react-bootstrap";
import facepaint from "facepaint";
import { Link } from "react-router-dom";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

function CollectionListPage() {
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editedNumber, setEditedNumber] = useState(0);

  const onInput = ({ target: { value } }) => setCollectionName(value);

  useEffect(() => {
    if (localStorage.getItem("collections") !== null)
      setCollections(JSON.parse(localStorage.getItem("collections")));
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const saveCollections = () => {
    var arrayOfCollections = [...collections];
    if (isEdit === true) {
      console.log(arrayOfCollections);
      console.log(editedNumber);
      arrayOfCollections[editedNumber].collectionName = collectionName;
    } else {
      var collection = {
        collectionName: collectionName,
        listAnime: [],
      };
      arrayOfCollections.push(collection);
    }
    localStorage.setItem("collections", JSON.stringify(arrayOfCollections));
    setCollections(arrayOfCollections);
    setShowModal(false);
  };

  const removeCollections = (number) => {
    var temp = [...collections];
    temp.splice(number, 1);
    setCollections(temp);
    console.log(collections);
    //items = items;
    localStorage.setItem("collections", JSON.stringify(collections));

    console.log(JSON.parse(localStorage.getItem("collections")));
  };

  const openEditDialog = (number) => {
    var temp = [...collections];
    setEditedNumber(number);
    console.log(editedNumber);
    setCollectionName(temp[number].collectionName);
    setShowModal(true);
    setIsEdit(true);
  };

  let items = [];
  //console.log(collections.length);
  console.log(collections);
  for (let number = 0; number < collections.length; number++) {
    items.push(
      <Row
        key={number}
        css={mq({
          paddingTop: "5px",
          paddingBottom: "5px",
        })}
      >
        <Col md={2} xs={3}>
          <Link to="/collections_details">
            <img
              src="https://i.pinimg.com/564x/a3/ac/1e/a3ac1ed5abaedffd9947face7901e14c.jpg"
              alt="defaultImage"
              css={mq({
                width: "100%",
                maxHeight: "auto",
                float: "left",
              })}
            ></img>
          </Link>
        </Col>
        <Col md={6} xs={5}>
          <h5
            css={mq({
              float: "left",
            })}
          >
            {collections[number].collectionName}
          </h5>
        </Col>
        <Col xs={4}>
          <Button
            css={mq({
              float: "right",
            })}
            variant="danger"
            onClick={() => removeCollections(number)}
          >
            Remove
          </Button>
          <Button
            css={mq({
              float: "right",
            })}
            variant="success"
            onClick={() => openEditDialog(number)}
          >
            Edit
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <div
      css={mq({
        paddingTop: "20px",
        paddingBottom: "20px",
      })}
    >
      <Row>
        <Col>
          <h3
            css={mq({
              float: "left",
            })}
          >
            List of Collections
          </h3>
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={handleShow}
            css={mq({
              float: "right",
            })}
          >
            Add Collections
          </Button>
        </Col>
      </Row>
      {items}

      <Modal show={showModal} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Collections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Collection Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insert your collection name"
                value={collectionName}
                onChange={onInput}
              />
            </Form.Group>
            <Button variant="primary" onClick={saveCollections}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CollectionListPage;
