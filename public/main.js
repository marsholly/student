"use strict";

$(()=>{

  $('#messageModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var name = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message from ' + name)
    modal.find('.modal-body input').val(name)
  });

  $('.sendMsg').on('click',addInfos);
  $('table').on('click','.delete', deleteStudent);
  $('table').on('click','.edit', openEditModal);
  $('.sendEditMsg').on('click', updateInfo);
});


function addInfos(event){
  event.preventDefault();
  let newStudents ={
    name: $('#messageModal').find('.name').val(),
    total:$('#messageModal').find('.total').val(),
    score:$('#messageModal').find('.score').val(),
  };
  $('#messageModal').find('.name').val('');
  $('#messageModal').find('.total').val('');
  $('#messageModal').find('.score').val('');
   $.post(`/studentRoute`,newStudents)
    .done(()=>{
      renderList();
      $('#newClose').click();
    })
}

function deleteStudent(){
  console.log('here!!!')
  let studentId = $(this).closest('tr').data('id');
  $.ajax(`/studentRoute/${studentId}`,{
      method: 'DELETE'
  })
   .done(()=>{
      renderList();
   })
   .fail(err=>{
      console.log('err:',err);
   })
}

function openEditModal(){
  let $row = $(this).closest('tr');
  let $editModal = $('#editMsgModal');

  let studentId = $row.data('id');
  $editModal.data('studentId', studentId);   //give id to modal
  
  let name = $row.find('.name').text();
  $editModal.find('.name').val(name);
   
  let total = $row.find('.total').text();
  $editModal.find('.total').val(total);

  let score = $row.find('.score').text();
  $editModal.find('.score').val(score);
}

function updateInfo(event){
  let $editModal = $('#editMsgModal');
  let id = $('#editMsgModal').data('studentId');
  
  $.ajax({
    url:`/studentRoute/${id}`,
    type: 'PUT',
    data:{
      name: $editModal.find('.name').val(),
      total: $editModal.find('.total').val(),
      score: $editModal.find('.score').val()
    },
    success:function(data){ 
      renderList();
      $('#editClose').click();
    } 
  });
}

function renderList(){
  $.get('/studentRoute')
   .done(students=>{
      let $trs = students.map(student=>{
        let $tr = $('#template').clone();
        $tr.removeAttr('id');
        $tr.find('.name').text(student.name);
        $tr.find('.total').text(student.total);
        $tr.find('.score').text(student.score);
        $tr.find('.grade').text(student.grade);
        $tr.data('id', student.id); 
        return $tr;
      });
      $('#studentList').empty().append($trs);
   })
  $.get('/studentRoute/totals')
   .done(obj=>{
      $('.sumTotal').text(obj.total_possible);
      $('.sumScore').text(obj.total_score);
      let grades = obj.grade;
      let output ='';
      for(let result in grades){
        output += result+': '+ grades[result] +'; ';
      }
      $('.sumGrade').text(output);
   });
}

