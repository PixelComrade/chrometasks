// Utility functions that control the storage of information in and out of the application

var logging = true;

function Tracker()
{
  this.allTasks = new Array();
}

// Intercept click events on checkboxes and run own code
Tracker.prototype.updates = function()
{
  var owner = this;
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
      log("Set " + $(target).parent().text() + " as done, removing");
      owner.removeTask($(target).parent().text());
      setTimeout(function(){
        $(target).parent().parent('li').remove();
      }, 2000);
    }
  });
}

// Display all current data as a visual list in the DOM
Tracker.prototype.displayData = function()
{
  if(this.allTasks != null)
  {
    for(var i = 0; i < this.allTasks.length; i++)
    {
      $('#tasklist').append(
        '<li class="' + this.allTasks[i] + '"><div class="task">' + this.allTasks[i] + '<input type="checkbox" class="status ' + this.allTasks[i] + '">' + '</input></div></li>'
      );
      this.updates();
    }
  }
}

// Add a task to the task array
Tracker.prototype.addTask = function(task)
{
  $('#tasklist').append(
    '<li class="' + task + '"><div class="task">' + task + '<input type="checkbox" class="status">' + '</input></div></li>'
  );
  this.updates();

  if(this.allTasks == null)
    this.allTasks = new Array();
  this.allTasks.push(task);

  this.syncStorage();
  log("Adding task: " + task);
}

// Remove a task from the task array and from the DOM
Tracker.prototype.removeTask = function(task)
{
	// TODO - There has to be a more efficient way to remove an element from a dynamic array
  // If this function is called, that means there are tasks in the list
  log("Task list before remove: " + this.allTasks);

  var result = this.allTasks;
  this.allTasks = [];
  log("Task list before remove: " + this.allTasks);

  var index = result.indexOf(task);
  if(index != -1)
    result.splice(index, 1);
  this.allTasks = result;
/*
  for(var i = 0; i < this.allTasks.length; i++)
  {
    if(this.allTasks[i] != task)
      result.push(this.allTasks[i]);
  }
  this.allTasks = result;
*/
  log("Task list after remove: " + this.allTasks);
  //$('li.' + task).remove();
  log('About to remove ' + task + ' from list');
  this.syncStorage();
  log('Removed ' + task + ' from list');
}

// Remove all tasks still in task list
Tracker.prototype.removeAllTasks = function()
{
  if(this.allTasks != null)
  {
    this.allTasks = null;
    $('li').remove();
    this.syncStorage();
  }
}

// Sync local storage with current task array
Tracker.prototype.syncStorage = function()
{
  log("Pushing data");
  clearStrg();
	if(this.allTasks != null) // There are tasks to push back upto local storage
  {
    this.allTasks = prepArray(this.allTasks);
    setItem('tasks', this.allTasks);
    this.allTasks = resetArray(this.allTasks);
  }
}

// Sync current array with local storage
Tracker.prototype.syncArray = function()
{
  log("Pulling data");
  var values = getItem('tasks');
  if(!isBlank(values))
  {
    if(values.indexOf('---,---') == -1)
    {
      log("Getting only one value");
      values = values.replace("---","");
      this.allTasks = new Array();
      this.allTasks.push(values);
    }
    else
    {
      log("Getting multiple values");
      this.allTasks = values.split("---,---");
      this.allTasks = resetArray(this.allTasks);
    }
  }
  log("Arrayed values: " + this.allTasks);
  log("Length of arrayed values: " + this.allTasks.length);
}

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
  return value;
}

function clearStrg() 
{
  log('About to clear local storage');
  window.localStorage.clear();
  log('cleared storage');
}

/** Utility methods **/
/*********************/
function isBlank(value)
{
  return (!value || /^\s*$/.test(value));
}

function prepArray(list)
{
  for(var i = 0; i < list.length; i++)
  {
    if(list[i].indexOf('---') == -1)
      list[i] = "---" + list[i] + "---";
  }
  return list;
}

function resetArray(list)
{
  for(var i = 0; i < list.length; i++)
  {
    list[i] = list[i].replace("---","");
  }
  return list;
}

/** Logging **/
/*************/
function log(txt) 
{
  if(logging) 
  {
    console.log(txt);
  }
}