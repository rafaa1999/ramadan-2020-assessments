
const listOfVidsElm = document.getElementById('listOfRequests');

function getSingleVidReq(vidInfo, isPrepend = false){
  const vidReqContainerElm = document.createElement('div');
  vidReqContainerElm.innerHTML = `
  <div class="card mb-3">
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${vidInfo.topic_title}</h3>
          <p class="text-muted mb-2">${vidInfo.topic_details}</p>
          <p class="mb-0 text-muted">
            ${
              vidInfo.expected_result &&
              `<strong>Expected results:</strong> ${vidInfo.expected_result}`
            }
          </p>
        </div>
        <div class="d-flex flex-column text-center">
          <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
          <h3 id="score_vote_${vidInfo._id}">${vidInfo.votes.ups - vidInfo.votes.downs}</h3>
          <a id="votes_downs_${vidInfo._id}" class="btn btn-link">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div>
          <span class="text-info">${vidInfo.status.toUpperCase()}</span>
          &bullet; added by <strong>${vidInfo.author_name}</strong> on
          <strong>${new Date(vidInfo.submit_date).toLocaleDateString()}</strong>
        </div>
        <div
          class="d-flex justify-content-center flex-column 408ml-auto mr-2"
        >
          <div class="badge badge-success">
          ${vidInfo.target_level}
          </div>
        </div>
      </div>
  </div>
  `;

  if(isPrepend){
    listOfVidsElm.prepend(vidReqContainerElm)
  }else{
    listOfVidsElm.appendChild(vidReqContainerElm);
  }

  const voteUpsElm = document.getElementById(`votes_ups_${vidInfo._id}`);
  const voteDownsElm = document.getElementById(`votes_downs_${vidInfo._id}`);
  const scoreVote = document.getElementById(`score_vote_${vidInfo._id}`);

  voteUpsElm.addEventListener('click', (e)=>{
    fetch('http://localhost:7777/video-request/vote',{
      method: 'PUT',
      headers: {'content-Type': 'application/json'},
      body: JSON.stringify({ id : vidInfo._id, vote_type : 'ups' })
    }).then(bold => bold.json())
      .then(data => {
        scoreVote.innerText = data.ups - data.downs ;
      })
  })

  voteDownsElm.addEventListener('click', (e)=>{
    fetch('http://localhost:7777/video-request/vote',{
      method: 'PUT',
      headers: {'content-Type': 'application/json'},
      body: JSON.stringify({ id : vidInfo._id, vote_type : 'downs' })
    }).then(bold => bold.json())
      .then(data => {
        scoreVote.innerText = data.ups - data.downs ;
      })
  })

}

function loadAllVidReqs(sortBy = 'newFirst'){

  fetch(`http://localhost:7777/video-request?sortBy=${sortBy}`)
  .then(bold=>bold.json())
  .then(data=>{
    listOfVidsElm.innerHTML = '';
    data.forEach(vidInfo => {
      getSingleVidReq(vidInfo)
    });
  });

}

// The entry point of js
document.addEventListener('DOMContentLoaded', function(){

  const formVidReqElm = document.getElementById('formVideoRequest');
  const sortByElm = document.querySelectorAll('[id*=sort_by_]')

  loadAllVidReqs();

  sortByElm.forEach(elm=>{
    elm.addEventListener('click',function(e){
      e.preventDefault();

      const sortBy = this.querySelector('input');
      // console.log(sortBy.value);
      loadAllVidReqs(sortBy.value)

      this.classList.add('active');
      if(sortBy.value === 'topVotedFirst'){
        document.getElementById('sort_by_new').classList.remove('active');
      }else{
        document.getElementById('sort_by_top').classList.remove('active');
      }


    })
  })

  formVidReqElm.addEventListener('submit',(e)=>{
      e.preventDefault(); 
      const formData = new FormData(formVidReqElm);

      fetch('http://localhost:7777/video-request',{
        method:"POST",
        body: formData,
      }).then((bold) => bold.json())
      .then((data)=>{
        getSingleVidReq(data, true);
      })
  })

})
