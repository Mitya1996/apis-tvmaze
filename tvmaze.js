/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let showList = res.data;
  return showList.map(show => ({
    id: show.show.id,
    name: show.show.name,
    summary: show.show.summary,
    image: show.show.image.original ? show.show.image.original : 'https://tinyurl.com/tv-missing'
  }));
}


// our handleSearch event handler ties the two together: it gets the search term, gets the shows using 
/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show mb-3" data-show-id="${ show.id }">
         <div class="card" data-show-id="${ show.id }">
            <img class="card-img-top" src="${ show.image }">
            <div class="card-body">
              <h5 class="card-title">${ show.name }</h5>
              <p class="card-text">${ show.summary }</p>
              <button id="list-episodes-btn" class="btn btn-success">List Episodes</button>
            </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let res = await axios.get(`http://api.tvmaze.com/shows/${ id }/episodes`);
  // TODO: return array-of-episode-info, as described in docstring above
  let episodeList = res.data;

  return episodeList.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));

}

async function populateEpisodes(showId) {

  let episodes = await getEpisodes(showId);
  
  for(episode of episodes) {
    $('#episodes-list').append(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
  }

  $('#episodes-area').css('display', 'inline');
}

$('#shows-list').on('click', '#list-episodes-btn', function(){
  $('#episodes-list').empty();
  let id = $(this).parent().parent().attr('data-show-id');
  populateEpisodes(id);
});