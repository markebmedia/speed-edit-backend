import torch
import torch.nn as nn

def default_init_weights(module_list, scale=1, bias_fill=0):
    if not isinstance(module_list, list):
        module_list = [module_list]
    for module in module_list:
        for name, param in module.named_parameters():
            if 'weight' in name:
                nn.init.kaiming_normal_(param, a=0, mode='fan_in')
                param *= scale
            elif 'bias' in name:
                nn.init.constant_(param, bias_fill)

def to_2tuple(x):
    return (x, x)

def trunc_normal_(tensor, mean=0., std=1.):
    with torch.no_grad():
        return tensor.normal_(mean, std)
