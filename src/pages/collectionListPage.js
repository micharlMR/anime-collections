import { useEffect, useState } from "react";
import { Button, Row, Col, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import facepaint from "facepaint";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

function CollectionListPage() {
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editedNumber, setEditedNumber] = useState(0);
  const [removedNumber, setRemovedNumber] = useState(0);

  const onInput = ({ target: { value } }) => {
    if (/^[^!-\/:-@\[-`{-~]+$/.test(value) || value === "") {
      setCollectionName(value);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("collections") !== null)
      setCollections(JSON.parse(localStorage.getItem("collections")));
  }, []);

  //open modal for edit and add collection
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // open modal for remove collection
  const handleShow2 = () => setShowModal2(true);
  const handleClose2 = () => setShowModal2(false);

  // save collection based on its editting or not
  const saveCollections = () => {
    var arrayOfCollections = [...collections];
    if (isEdit === true) {
      arrayOfCollections[editedNumber].collectionName = collectionName;
      setIsEdit(false);
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

  // remove collection from array
  const removeCollections = () => {
    var temp = [...collections];
    temp.splice(removedNumber, 1);
    setCollections(temp);
    localStorage.setItem("collections", JSON.stringify(temp));
    handleClose2();
  };

  // open edit dialog
  const openEditDialog = (number) => {
    var temp = [...collections];
    setEditedNumber(number);
    setCollectionName(temp[number].collectionName);
    setShowModal(true);
    setIsEdit(true);
  };

  // open add dialog
  const openAddDialog = () => {
    setCollectionName("");
    handleShow();
  };

  // open remove dialog
  const openRemoveDialog = (number) => {
    var temp = [...collections];
    setRemovedNumber(number);
    setCollectionName(temp[number].collectionName);
    handleShow2();
  };

  const Items = () => {
    // if there is no collection
    if (collections.length <= 0) {
      return (
        <Row>
          <Col>
            <p
              css={mq({
                float: "left",
              })}
            >
              There is no collections yet.
            </p>
          </Col>
          <Col></Col>
        </Row>
      );
    }

    // if there is a collection
    return collections.map((collection, key) => {
      return (
        <Row
          key={key}
          css={mq({
            paddingTop: "5px",
            paddingBottom: "5px",
          })}
        >
          <Col md={2} xs={3}>
            <Link to="/collections_details" state={{ id: key }}>
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
              {collection.collectionName}
            </h5>
          </Col>
          <Col xs={4}>
            <Button
              css={mq({
                float: "right",
              })}
              variant="danger"
              onClick={() => openRemoveDialog(key)}
            >
              Remove
            </Button>
            <Button
              css={mq({
                float: "right",
              })}
              variant="success"
              onClick={() => openEditDialog(key)}
            >
              Edit
            </Button>
          </Col>
        </Row>
      );
    });
  };

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
            onClick={openAddDialog}
            css={mq({
              float: "right",
            })}
          >
            Add Collections
          </Button>
        </Col>
      </Row>
      <Items />

      {/* Modal for add and edit collection */}
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

      {/* Modal for remove collection */}
      <Modal show={showModal2} onHide={handleClose2} keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Collections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Remove {collectionName} Collection </Form.Label>
            </Form.Group>
            <Button variant="danger" onClick={removeCollections}>
              Remove
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CollectionListPage;
