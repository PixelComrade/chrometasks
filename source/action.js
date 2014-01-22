// Main js file to control the extension behaviour

var logging = true;
var allTasks = new Array();

/** Storage methods **/
/*********************/
function setItem(key, value) 
{
  try 
  {
    log("Storing [" + key + ":" + value + "]");
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  } 
  catch(e) 
  {
    log("Error inside setItem()");
    log(e);
  }
  log("Return from setting item " + key + ":" +  value);
}

function getItem(key) 
{
  var value;
  log('Retrieving key [' + key + ']');
  try 
  {
    value = window.localStorage.getItem(key);
  }
  catch(e) 
  {
    log("Error inside getItem() for key:" + key);
    log(e);
    value = "null";
  }
  log("Returning value: " + value);
  if(value != null)
  {
    value = value.split("-'-','-'-");
    for(var i = 0; i < value.length; i++)
    {
      value[i] = value[i].replace("'-'-","");
      value[i] = value[i].replace("-'-'","");
      value[i] = value[i].replace("'-","");
      value[i] = value[i].replace("-'","");
    }
  }
  log("Array values: " + value);
  return value;
}

function clearStrg() 
{
  log('About to clear local storage');
  window.localStorage.clear();
  log('cleared');
}

/** Task management methods **/
/*****************************/
function addTask(task)
{
  displayNewTask(task);
  
  task = addTaskDelimiters(task);
  log("Adding task: " + task);

  if(allTasks == null)
    allTasks = new Array();

  allTasks.push(task);
  setItem('tasks', allTasks);
  updateTaskList();
  readableTaskList();
}

function removeTask(task)
{
  // TODO - There has to be a more efficient way to remove an element from a dynamic array
  var result = new Array();
  for(var i = 0; i < allTasks.length; i++)
  {
    if(allTasks[i] != task)
      result.push(allTasks[i]);
  }
  allTasks = result;
  log('Removed ' + task + ' from list');
  clearStrg();
  if(allTasks.length > 0)
  {
    setItem('tasks', allTasks);
  }

  updateTaskList();
  readableTaskList();
}

function removeAllTasks()
{
  $('li').remove();
}

function addTaskDelimiters(task)
{
  // A task string will look like this: '-'-Some task...-'-'
  //var before = "'-'-";
  //task = before.concat(task);
  log("Adding delimiters to " + task);
  task = "'-'-" + task + "-'-'";
  log("Delimitered task: " + task);
  //task = task.concat("-'-'");
  return task;
}

function addAllTaskDelimiters()
{
  for(var i = 0; i < allTasks.length; i++)
  {
    allTasks[i] = addTaskDelimiters(allTasks[i]);
  }
}

function updateTaskList()
{
  if(allTasks != null)
  {
    clearStrg();
    addAllTaskDelimiters();
    setItem('tasks', allTasks);
  }
}

function readableTaskList()
{
  if(allTasks != null)
  {
    for(var i = 0; i < allTasks.length; i++)
    {
      allTasks[i] = allTasks[i].replace("'-'-","");
      allTasks[i] = allTasks[i].replace("-'-'","");
    }
  }
}

/** DOM manipulation methods **/
/******************************/
function initData()
{
  log("Initing data");
  allTasks = getItem('tasks');
}

function displayData()
{
  initData();
  if(allTasks != null)
  {
    for(var i = 0; i < allTasks.length; i++)
    {
      $('#tasklist').append('<li><div class="task">' + allTasks[i] + '<input type="checkbox" class="status">' + '</input></div></li>');
    }
  }
}

function displayNewTask(task)
{
  $('#tasklist').append('<li><div class="task">' + task + '<input type="checkbox" class="status">' + '</input></div></li>');
  statusChanges(); // This needs to be here and in the main method in order to work with dynamically created DOM elements
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
      }, 2000);
    }
  });
}

/** The main method **/
/*********************/
$(function()
{
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
    removeAllTasks();
    clearStrg();
  });

  statusChanges(); // This needs to be here and in the main method in order to work with dynamically created DOM elements
});

$(window).unload(function()
{
  updateTaskList();
});

/** Logging **/
/*************/
function log(txt) 
{
  if(logging) 
  {
    console.log(txt);
  }
}