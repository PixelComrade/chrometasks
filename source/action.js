// Main js file to control the extension behaviour

/** The main method **/
/*********************/
$(function()
{
  taskmanager = new Tracker();
  taskmanager.syncArray();
  taskmanager.displayData();

  var value = '';

  $('#addtask').bind("enterKey", function(e)
  {
    value = $('#addtask').val();
    $('#addtask').val('');
    taskmanager.addTask(value);
  });

  $('#addtask').keyup(function(e)
  {
    if(e.keyCode == 13)
    {
      value = $('#addtask').val();
      if(value !== "" && value !== "Add a task")
        $(this).trigger("enterKey");
    }
  });

  $('.btn-clear').click(function()
  {
    taskmanager.removeAllTasks();
  });

  taskmanager.updates();
});

$(window).unload(function()
{
  taskmanager.syncStorage();
});