import { useEffect, useState } from "react";
import { Button, Row, Col, Modal, Form } from "react-bootstrap";
import facepaint from "facepaint";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

function CollectionListPage() {
  const [collections, setCollections] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const onInput = ({ target: { value } }) => setCollectionName(value);

  useEffect(() => {
    setCollections(localStorage.getItem("collections"));
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const saveCollections = () => {
    var arrayOfCollections = [];
    var collection = {
      collectionName: collectionName,
      listAnime: [],
    };
    arrayOfCollections.push(collection);
    localStorage.setItem("collections", JSON.stringify(arrayOfCollections));
    setShowModal(false);
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
            onClick={handleShow}
            css={mq({
              float: "right",
            })}
          >
            Add Collections
          </Button>
        </Col>
      </Row>

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
