import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { Row, Col, Pagination } from "react-bootstrap";
import facepaint from "facepaint";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

const REQLISTANIMEPAGING = gql`
  query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id: $id, search: $search) {
        id
        title {
          romaji
        }
        coverImage {
          extraLarge
        }
        averageScore
      }
    }
  }
`;

function AnimeListPage() {
  const [active, setActive] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => setActive(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <Row
        css={mq({
          paddingTop: "20px",
          paddingBottom: "20px",
        })}
      >
        <GetAnimeListPerPage active={active} />
      </Row>

      <div
        css={mq({
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        })}
      >
        <Pagination>{items}</Pagination>
      </div>
    </div>
  );

  function GetAnimeListPerPage(props) {
    const { loading, error, data } = useQuery(REQLISTANIMEPAGING, {
      variables: {
        page: props.active,
        perPage: 10,
      },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log(data);

    return data.Page.media.map(({ id, title, coverImage, averageScore }) => (
      <Col
        xs={6}
        md={6}
        lg={4}
        xl={3}
        key={id}
        css={mq({
          paddingTop: "5px",
          paddingBottom: "5px",
        })}
      >
        <Row>
          <Col md={6}>
            <Link to="/anime_details" state={{ id: id }}>
              <img
                css={mq({
                  width: "100%",
                  maxHeight: "auto",
                  float: "left",
                  objectFit: "fill",
                })}
                src={coverImage.extraLarge}
                alt={coverImage.extraLarge}
              ></img>
            </Link>
          </Col>
          <Col md={6}>
            <h6
              css={mq({
                float: "left",
                textAlign: "left",
              })}
            >
              {title.romaji}
            </h6>
            <p
              css={mq({
                float: "left",
                textAlign: "left",
              })}
            >
              Average Score {averageScore} / 100
            </p>
          </Col>
        </Row>
      </Col>
    ));
  }
}

export default AnimeListPage;
