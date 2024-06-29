function list_child_processes () {
    local ppid=$1;
    local current_children=$(pgrep -P $ppid);
    local local_child;
    if [ $? -eq 0 ];
    then
        for current_child in $current_children
        do
          local_child=$current_child;
          list_child_processes $local_child;
          echo $local_child;
        done;
    else
      return 0;
    fi;
}

ps 20217;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 20217 > /dev/null;
done;

for child in $(list_child_processes 20218);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/macieklazar/Documents/ReactApp-main/ReactApp.Server/bin/Debug/net8.0/d562ae23f80d4921958d06871640c45d.sh;
