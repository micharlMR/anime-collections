import { useLocation } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Row, Col, Button } from "react-bootstrap";
import facepaint from "facepaint";

/** @jsxImportSource @emotion/react */

const breakpoints = [576, 768, 992, 1200];

const mq = facepaint(breakpoints.map((bp) => `@media (min-width: ${bp}px)`));

const REQDETAILANIME = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
      id
      title {
        romaji
      }
      description
      coverImage {
        extraLarge
      }
      genres
      episodes
      averageScore
    }
  }
`;

function AnimeDetails(props) {
  const { loading, error, data } = useQuery(REQDETAILANIME, {
    variables: {
      id: props.idAnime,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  let genres = "";

  for (let number = 0; number < data.Media.genres.length; number++) {
    if (number !== data.Media.genres.length - 1)
      genres = genres.concat(data.Media.genres[number] + ", ");
    else genres = genres.concat(data.Media.genres[number]);
  }

  console.log(data.Media.genres);

  //data.Media.genres.map((note) => (genres = genres.concat({ note } + " ")));

  //console.log(genres);

  return (
    <div
      css={mq({
        paddingTop: "20px",
        paddingBottom: "20px",
      })}
    >
      <Row>
        <Col lg={6} md={12} xs={12}>
          <img
            src={data.Media.coverImage.extraLarge}
            alt={data.Media.coverImage.extraLarge}
          ></img>
        </Col>
        <Col lg={6} md={12} xs={12}>
          <h3>{data.Media.title.romaji}</h3>

          <div dangerouslySetInnerHTML={{ __html: data.Media.description }} />
          <p>Total Episodes: {data.Media.episodes} episodes</p>
          <p>Average Scores: {data.Media.averageScore} out of 100</p>
          <p>Genres: {genres}</p>
          <Button
            variant="primary"
            onClick={() => addToCollection(data.Media.id)}
          >
            add this to local storage
          </Button>
        </Col>
      </Row>
    </div>
  );
}

function addToCollection(id) {
  // var something = [16];
  // localStorage.setItem("collections", JSON.stringify(something));
  var arrayCollections = [];
  var temp = localStorage.getItem("collections");
  console.log(temp);
  if (temp !== null) arrayCollections = JSON.parse(temp);
  console.log(arrayCollections);
  arrayCollections.push(id);
  console.log(arrayCollections);
  localStorage.setItem("collections", JSON.stringify(arrayCollections));

  // if (localStorage.getItem("collections") == id) {
  //   console.log("ID sudah ada di local storage");
  // }
  //localStorage.setItem("collections", id);
}

function AnimeDetailPage() {
  const location = useLocation();
  const { id } = location.state;
  console.log(id);

  return <AnimeDetails idAnime={id} />;
}

export default AnimeDetailPage;
