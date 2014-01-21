// Main js file to control the extension

var logging = false;
var allTasks = new Array();

$(function()
{
  initData();
  displayData();

  var value = '';

  $('#addtask').bind("enterKey", function(e)
  {
    value = $('#addtask').val();
    $('#addtask').val('');
    addTask(value);
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
    log("Clearing storage");
    clearStrg();
  });

  statusChanges();
});

function initData()
{
  //allTasks = chrome.storage.local.get('allTasks');
  allTasks = getItem('tasks');
}

function displayData()
{
  if(allTasks != null)
  {
    for(var i = 0; i < allTasks.length; i++)
    {
      $('#tasklist').append('<li><div class="task">' + allTasks[i] + '<input type="checkbox" class="status">' + '</input></div></li>');
    }
  }
}

function addTask(task)
{
  $('#tasklist').append('<li><div class="task">' + task + '<input type="checkbox" class="status">' + '</input></div></li>');
  statusChanges();

  if(allTasks == null)
    allTasks = new Array();

  allTasks.push(task);
  //chrome.storage.local.set({'tasks': allTasks});
  setItem('tasks', allTasks);
}

function removeTask(task)
{
  var result = new Array();
  for(var i = 0; i < allTasks.length; i++)
  {
    if(allTasks[i] != task)
      result.push(allTasks[i]);
  }
  allTasks = result;
  log('removed ' + task + ' from list');
  clearStrg();
  if(allTasks.length > 0)
    setItem('tasks', allTasks);
}

function statusChanges()
{
  $('.status').click(function(e)
  {
    if($(this).attr('checked'))
      e.preventDefault();
    else
    {
      $(this).attr('checked', 'checked');
      $(this).parent().parent('li').addClass('done');
      $(this).parent().parent('li').prepend('<div class="done-text">DONE</div>');
      // TODO - Add a smoother remove animation
      var target = this;
      setTimeout(function(){
        removeTask($(target).parent().text());
        $(target).parent().parent('li').remove();
      }, 2050);
    }
  });
}

// Store item in local storage:
function setItem(key, value) {
  try {
    log("Storing [" + key + ":" + value + "]");
    window.localStorage.removeItem(key);      // <-- Local storage!
    window.localStorage.setItem(key, value);  // <-- Local storage!
  } catch(e) {
    log("Error inside setItem");
    log(e);
  }
  log("Return from setItem" + key + ":" +  value);
}

// Gets item from local storage with specified key.
function getItem(key) {
  var value;
  log('Retrieving key [' + key + ']');
  try {
    value = window.localStorage.getItem(key);  // <-- Local storage!
  }catch(e) {
    log("Error inside getItem() for key:" + key);
    log(e);
    value = "null";
  }
  log("Returning value: " + value);
  if(value != null)
    value = value.split(',');
  log("Arrayed value: " + value);
  return value;
}

// Clears all key/value pairs in local storage.
function clearStrg() {
  log('about to clear local storage');
  window.localStorage.clear(); // <-- Local storage!
  log('cleared');
}

function log(txt) {
  if(logging) {
    console.log(txt);
  }
}