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

ps 25395;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 25395 > /dev/null;
done;

for child in $(list_child_processes 25396);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/macieklazar/Documents/ReactApp-main/ReactApp.Server/bin/Debug/net8.0/d0b2e8d63cc24b19be280b88cb636fe0.sh;
